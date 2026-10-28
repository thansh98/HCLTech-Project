from .models import AuditLog

def record_audit_log(user, action, entity_name, entity_id, details=None):
    """Direct service to record an audit log."""
    user_instance = user if getattr(user, 'is_authenticated', False) else None
    return AuditLog.objects.create(
        user=user_instance,
        action=action,
        entity_name=str(entity_name),
        entity_id=str(entity_id),
        details=details or {}
    )
