from .models import AuditLog

def list_audit_logs(user_id=None, entity_name=None, action=None):
    """Retrieve filtered audit logs."""
    qs = AuditLog.objects.select_related('user').order_by('-timestamp')
    if user_id:
        qs = qs.filter(user_id=user_id)
    if entity_name:
        qs = qs.filter(entity_name__iexact=entity_name)
    if action:
        qs = qs.filter(action__icontains=action)
    return qs
