from django.core.exceptions import ValidationError
from common.utils import log_audit_action
from .models import Facility

def create_facility(name, category, status='active', location_description='', manager_ids=None, acting_user=None):
    """Service to create a new facility with audit logging."""
    if not name or not category:
        raise ValidationError({'name': 'Name and category are required fields.'})

    facility = Facility.objects.create(
        name=name,
        category=category,
        status=status,
        location_description=location_description or ''
    )
    if manager_ids:
        facility.managers.set(manager_ids)

    log_audit_action(acting_user, 'FACILITY_CREATED', 'Facility', facility.id, {
        'name': name,
        'category': category,
        'status': status
    })
    return facility

def update_facility(facility, data, acting_user=None):
    """Service to update a facility."""
    for field in ['name', 'category', 'status', 'location_description']:
        if field in data:
            setattr(facility, field, data[field])
    facility.save()

    if 'manager_ids' in data:
        facility.managers.set(data['manager_ids'])

    log_audit_action(acting_user, 'FACILITY_UPDATED', 'Facility', facility.id, data)
    return facility

def delete_facility(facility, acting_user=None):
    """Service to delete a facility."""
    facility_id = facility.id
    name = facility.name
    facility.delete()
    log_audit_action(acting_user, 'FACILITY_DELETED', 'Facility', facility_id, {'name': name})
