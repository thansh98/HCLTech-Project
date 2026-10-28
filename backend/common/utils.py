import logging

logger = logging.getLogger(__name__)

def log_audit_action(user, action, entity_name, entity_id, details=None):
    """
    Records an entry in the AuditLog.
    Safely captures user actions across all domain apps.
    """
    try:
        from apps.audit.models import AuditLog
        user_instance = user if getattr(user, 'is_authenticated', False) else None
        AuditLog.objects.create(
            user=user_instance,
            action=action,
            entity_name=str(entity_name),
            entity_id=str(entity_id),
            details=details or {}
        )
    except Exception as e:
        logger.error(f"Failed to record audit log for {action} on {entity_name}: {e}")
