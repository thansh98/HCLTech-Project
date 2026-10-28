from django.db.models import Sum
from .models import RenewableRecord

def list_renewable_records(facility_id=None, source_type=None, start_date=None, end_date=None):
    """Retrieve filtered renewable records."""
    qs = RenewableRecord.objects.select_related('facility').order_by('-record_time')
    if facility_id:
        qs = qs.filter(facility_id=facility_id)
    if source_type:
        qs = qs.filter(source_type=source_type)
    if start_date:
        qs = qs.filter(record_time__gte=start_date)
    if end_date:
        qs = qs.filter(record_time__lte=end_date)
    return qs

def get_renewable_breakdown(facility_id=None):
    """Returns generation breakdown grouped by source type (solar, wind, etc.)."""
    qs = RenewableRecord.objects.all()
    if facility_id:
        qs = qs.filter(facility_id=facility_id)

    breakdown = []
    for stype, label in RenewableRecord.SOURCE_CHOICES:
        total = qs.filter(source_type=stype).aggregate(total=Sum('generated_energy'))['total'] or 0
        breakdown.append({
            'source_type': stype,
            'label': label,
            'total_kwh': float(total)
        })
    return breakdown
