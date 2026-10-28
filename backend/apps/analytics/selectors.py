from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Avg, Count
from apps.energy.models import EnergyReading
from apps.renewables.models import RenewableRecord
from apps.alerts.models import Alert
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.billing.models import UtilityBill

def get_dashboard_summary(user=None, facility_id=None):
    """Calculates overall metrics for dashboard cards with role scoping."""
    energy_qs = EnergyReading.objects.all()
    renewables_qs = RenewableRecord.objects.all()
    alerts_qs = Alert.objects.filter(status__in=['new', 'acknowledged'])
    facilities_qs = Facility.objects.all()
    meters_qs = Meter.objects.all()
    bills_qs = UtilityBill.objects.all()

    if user and user.is_authenticated and not (user.role == 'admin' or user.is_superuser):
        if user.role == 'manager':
            facilities_qs = facilities_qs.filter(managers=user)
            meters_qs = meters_qs.filter(facility__managers=user)
            energy_qs = energy_qs.filter(meter__facility__managers=user)
            renewables_qs = renewables_qs.filter(facility__managers=user)
            alerts_qs = alerts_qs.filter(facility__managers=user)
            bills_qs = bills_qs.filter(facility__managers=user)
        else:
            assigned = facilities_qs.filter(managers=user)
            if assigned.exists():
                facilities_qs = assigned
                meters_qs = meters_qs.filter(facility__in=assigned)
                energy_qs = energy_qs.filter(meter__facility__in=assigned)
                renewables_qs = renewables_qs.filter(facility__in=assigned)
                alerts_qs = alerts_qs.filter(facility__in=assigned)
                bills_qs = bills_qs.filter(facility__in=assigned)

    if facility_id:
        energy_qs = energy_qs.filter(meter__facility_id=facility_id)
        renewables_qs = renewables_qs.filter(facility_id=facility_id)
        alerts_qs = alerts_qs.filter(facility_id=facility_id)
        meters_qs = meters_qs.filter(facility_id=facility_id)
        bills_qs = bills_qs.filter(facility_id=facility_id)

    total_consumption = energy_qs.aggregate(total=Sum('value'))['total'] or 0
    total_renewable = renewables_qs.aggregate(total=Sum('generated_energy'))['total'] or 0
    active_alerts_count = alerts_qs.count()
    active_facilities_count = facilities_qs.filter(status='active').count()
    active_meters_count = meters_qs.filter(status='active').count()

    total_consumption_float = float(total_consumption)
    total_renewable_float = float(total_renewable)

    renewable_percentage = 0.0
    if total_consumption_float > 0:
        renewable_percentage = round((total_renewable_float / total_consumption_float) * 100, 1)

    total_cost = float(bills_qs.aggregate(total=Sum('amount'))['total'] or 0)

    return {
        'total_consumption_kwh': total_consumption_float,
        'total_renewable_kwh': total_renewable_float,
        'renewable_percentage': renewable_percentage,
        'total_cost': total_cost,
        'active_alerts': active_alerts_count,
        'active_facilities': active_facilities_count,
        'active_meters': active_meters_count,
    }

def get_consumption_trends(user=None, days=7, facility_id=None):
    """
    Returns time-series consumption and renewable generation data
    aggregated by day over the last N days with role scoping.
    """
    now = timezone.now()
    labels = []
    consumption_series = []
    renewables_series = []

    for i in range(days - 1, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_label = day_date.strftime('%b %d')
        labels.append(day_label)

        day_start = timezone.make_aware(timezone.datetime.combine(day_date, timezone.datetime.min.time()))
        day_end = timezone.make_aware(timezone.datetime.combine(day_date, timezone.datetime.max.time()))

        eqs = EnergyReading.objects.filter(reading_time__range=(day_start, day_end))
        rqs = RenewableRecord.objects.filter(record_time__range=(day_start, day_end))

        if user and user.is_authenticated and not (user.role == 'admin' or user.is_superuser):
            if user.role == 'manager':
                eqs = eqs.filter(meter__facility__managers=user)
                rqs = rqs.filter(facility__managers=user)
            else:
                assigned = Facility.objects.filter(managers=user)
                if assigned.exists():
                    eqs = eqs.filter(meter__facility__in=assigned)
                    rqs = rqs.filter(facility__in=assigned)

        if facility_id:
            eqs = eqs.filter(meter__facility_id=facility_id)
            rqs = rqs.filter(facility_id=facility_id)

        c_sum = eqs.aggregate(total=Sum('value'))['total'] or 0
        r_sum = rqs.aggregate(total=Sum('generated_energy'))['total'] or 0

        consumption_series.append(float(c_sum))
        renewables_series.append(float(r_sum))

    return {
        'labels': labels,
        'consumption': consumption_series,
        'renewables': renewables_series
    }

def get_cost_analysis(user=None, facility_id=None):
    """Returns cost trends and distribution by facility with role scoping."""
    bills_qs = UtilityBill.objects.all().order_by('period_start')
    facilities_qs = Facility.objects.all()

    if user and user.is_authenticated and not (user.role == 'admin' or user.is_superuser):
        if user.role == 'manager':
            facilities_qs = facilities_qs.filter(managers=user)
            bills_qs = bills_qs.filter(facility__managers=user)
        else:
            assigned = facilities_qs.filter(managers=user)
            if assigned.exists():
                facilities_qs = assigned
                bills_qs = bills_qs.filter(facility__in=assigned)

    if facility_id:
        bills_qs = bills_qs.filter(facility_id=facility_id)

    facility_breakdown = []
    for fac in facilities_qs:
        fac_total = bills_qs.filter(facility=fac).aggregate(total=Sum('amount'))['total'] or 0
        facility_breakdown.append({
            'facility_id': fac.id,
            'facility_name': fac.name,
            'amount': float(fac_total)
        })

    return {
        'facilities_cost': facility_breakdown,
        'total_billed': float(bills_qs.aggregate(total=Sum('amount'))['total'] or 0)
    }
