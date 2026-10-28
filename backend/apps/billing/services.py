from decimal import Decimal
from django.core.exceptions import ValidationError
from common.utils import log_audit_action
from apps.facilities.models import Facility
from .models import UtilityBill

def create_bill(facility_id, provider, period_start, period_end, units, amount, due_date, status='pending', acting_user=None):
    """Service to create a utility bill."""
    facility = Facility.objects.filter(id=facility_id).first()
    if not facility:
        raise ValidationError({'facility': 'Facility not found.'})

    bill = UtilityBill.objects.create(
        facility=facility,
        provider=provider,
        period_start=period_start,
        period_end=period_end,
        units=Decimal(str(units)),
        amount=Decimal(str(amount)),
        due_date=due_date,
        status=status
    )
    log_audit_action(acting_user, 'BILL_CREATED', 'UtilityBill', bill.id, {
        'facility_id': facility_id,
        'provider': provider,
        'amount': str(amount)
    })
    return bill

def update_bill(bill, data, acting_user=None):
    """Service to update a utility bill."""
    for field in ['provider', 'period_start', 'period_end', 'units', 'amount', 'due_date', 'status']:
        if field in data:
            val = data[field]
            if field in ['units', 'amount']:
                val = Decimal(str(val))
            setattr(bill, field, val)
    if 'facility' in data:
        bill.facility = data['facility']
    bill.save()
    log_audit_action(acting_user, 'BILL_UPDATED', 'UtilityBill', bill.id, data)
    return bill

def delete_bill(bill, acting_user=None):
    """Service to delete a utility bill."""
    bill_id = bill.id
    provider = bill.provider
    bill.delete()
    log_audit_action(acting_user, 'BILL_DELETED', 'UtilityBill', bill_id, {'provider': provider})
