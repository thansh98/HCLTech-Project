from django.db.models import Sum
from .models import UtilityBill

def list_bills(facility_id=None, status=None, provider=None):
    """Retrieve filtered utility bills."""
    qs = UtilityBill.objects.select_related('facility').order_by('-due_date')
    if facility_id:
        qs = qs.filter(facility_id=facility_id)
    if status:
        qs = qs.filter(status=status)
    if provider:
        qs = qs.filter(provider__icontains=provider)
    return qs

def get_bill_by_id(bill_id):
    """Retrieve single utility bill."""
    return UtilityBill.objects.select_related('facility').filter(id=bill_id).first()
