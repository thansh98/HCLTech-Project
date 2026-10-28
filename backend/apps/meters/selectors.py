from .models import Meter

def list_meters(user=None, facility_id=None, energy_type=None, status=None, search=None):
    """Retrieve all meters with optional filters and role scoping."""
    qs = Meter.objects.select_related('facility').order_by('meter_code')
    if user and user.is_authenticated and not (user.role == 'admin' or user.is_superuser):
        if user.role == 'manager':
            qs = qs.filter(facility__managers=user)
        else:
            assigned = qs.filter(facility__managers=user)
            if assigned.exists():
                qs = assigned

    if facility_id:
        qs = qs.filter(facility_id=facility_id)
    if energy_type:
        qs = qs.filter(energy_type=energy_type)
    if status:
        qs = qs.filter(status=status)
    if search:
        qs = qs.filter(meter_code__icontains=search)
    return qs

def get_meter_by_id(meter_id):
    """Retrieve a single meter by ID."""
    return Meter.objects.select_related('facility').filter(id=meter_id).first()

def get_meter_by_code(meter_code):
    """Retrieve a meter by code."""
    return Meter.objects.select_related('facility').filter(meter_code=meter_code).first()
