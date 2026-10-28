from .models import Facility

def list_facilities(user=None, category=None, status=None, search=None):
    """Retrieve all facilities with optional filters and role-based scoping."""
    qs = Facility.objects.prefetch_related('managers').order_by('name')
    if user and user.is_authenticated and not (user.role == 'admin' or user.is_superuser):
        if user.role == 'manager':
            qs = qs.filter(managers=user)
        else:
            assigned = qs.filter(managers=user)
            if assigned.exists():
                qs = assigned

    if category:
        qs = qs.filter(category=category)
    if status:
        qs = qs.filter(status=status)
    if search:
        qs = qs.filter(name__icontains=search)
    return qs

def get_facility_by_id(facility_id):
    """Retrieve a single facility by ID."""
    return Facility.objects.filter(id=facility_id).prefetch_related('managers', 'meters').first()
