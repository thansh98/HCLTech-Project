from django.core.exceptions import ValidationError
from common.utils import log_audit_action
from apps.facilities.models import Facility
from .models import Meter

def create_meter(meter_code, facility_id, energy_type, unit='kWh', status='active', acting_user=None):
    """Service to create a new meter."""
    if Meter.objects.filter(meter_code=meter_code).exists():
        raise ValidationError({'meter_code': 'A meter with this code already exists.'})

    facility = Facility.objects.filter(id=facility_id).first()
    if not facility:
        raise ValidationError({'facility': 'Selected facility does not exist.'})

    meter = Meter.objects.create(
        meter_code=meter_code,
        facility=facility,
        energy_type=energy_type,
        unit=unit,
        status=status
    )
    log_audit_action(acting_user, 'METER_CREATED', 'Meter', meter.id, {
        'meter_code': meter_code,
        'facility_id': facility_id,
        'energy_type': energy_type
    })
    return meter

def update_meter(meter, data, acting_user=None):
    """Service to update a meter."""
    for field in ['meter_code', 'energy_type', 'unit', 'status']:
        if field in data:
            setattr(meter, field, data[field])
    if 'facility' in data:
        meter.facility = data['facility']
    meter.save()
    log_audit_action(acting_user, 'METER_UPDATED', 'Meter', meter.id, data)
    return meter

def delete_meter(meter, acting_user=None):
    """Service to delete a meter."""
    meter_id = meter.id
    code = meter.meter_code
    meter.delete()
    log_audit_action(acting_user, 'METER_DELETED', 'Meter', meter_id, {'meter_code': code})
