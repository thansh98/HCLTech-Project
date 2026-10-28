from django.db.models import Sum, Avg, Max, Min
from .models import EnergyReading

def list_readings(meter_id=None, facility_id=None, start_date=None, end_date=None):
    """Retrieve filtered energy readings."""
    qs = EnergyReading.objects.select_related('meter', 'meter__facility', 'created_by').order_by('-reading_time')
    if meter_id:
        qs = qs.filter(meter_id=meter_id)
    if facility_id:
        qs = qs.filter(meter__facility_id=facility_id)
    if start_date:
        qs = qs.filter(reading_time__gte=start_date)
    if end_date:
        qs = qs.filter(reading_time__lte=end_date)
    return qs

def get_reading_by_id(reading_id):
    """Retrieve a single reading."""
    return EnergyReading.objects.select_related('meter', 'meter__facility').filter(id=reading_id).first()

def get_total_consumption(facility_id=None, start_date=None, end_date=None):
    """Calculate aggregated consumption."""
    qs = EnergyReading.objects.all()
    if facility_id:
        qs = qs.filter(meter__facility_id=facility_id)
    if start_date:
        qs = qs.filter(reading_time__gte=start_date)
    if end_date:
        qs = qs.filter(reading_time__lte=end_date)
    total = qs.aggregate(total=Sum('value'))['total']
    return float(total) if total is not None else 0.0
