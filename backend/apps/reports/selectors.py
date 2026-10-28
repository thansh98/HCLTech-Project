from apps.energy.models import EnergyReading

def get_exportable_readings(meter_id=None, facility_id=None, start_date=None, end_date=None):
    """Retrieve readings for reporting with prefetched relationships."""
    qs = EnergyReading.objects.select_related('meter', 'meter__facility').order_by('-reading_time')
    if meter_id:
        qs = qs.filter(meter_id=meter_id)
    if facility_id:
        qs = qs.filter(meter__facility_id=facility_id)
    if start_date:
        qs = qs.filter(reading_time__gte=start_date)
    if end_date:
        qs = qs.filter(reading_time__lte=end_date)
    return qs
