from decimal import Decimal
from django.core.exceptions import ValidationError
from common.utils import log_audit_action
from apps.facilities.models import Facility
from .models import RenewableRecord

def record_renewable_generation(facility_id, source_type, record_time, generated_energy, unit='kWh', acting_user=None):
    """Service to record renewable energy generation."""
    facility = Facility.objects.filter(id=facility_id).first()
    if not facility:
        raise ValidationError({'facility': 'Facility not found.'})

    record = RenewableRecord.objects.create(
        facility=facility,
        source_type=source_type,
        record_time=record_time,
        generated_energy=Decimal(str(generated_energy)),
        unit=unit
    )
    log_audit_action(acting_user, 'RENEWABLE_RECORD_CREATED', 'RenewableRecord', record.id, {
        'facility_id': facility_id,
        'source_type': source_type,
        'generated_energy': str(generated_energy)
    })
    return record

def delete_renewable_record(record, acting_user=None):
    """Service to delete a renewable record."""
    record_id = record.id
    source = record.source_type
    record.delete()
    log_audit_action(acting_user, 'RENEWABLE_RECORD_DELETED', 'RenewableRecord', record_id, {'source_type': source})
