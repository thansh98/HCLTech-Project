from .models import Alert, Threshold, Notification

def list_alerts(status=None, severity=None, facility_id=None):
    """Retrieve filtered alerts."""
    qs = Alert.objects.select_related('threshold', 'facility', 'meter').order_by('-generated_at')
    if status:
        qs = qs.filter(status=status)
    if severity:
        qs = qs.filter(severity=severity)
    if facility_id:
        qs = qs.filter(facility_id=facility_id)
    return qs

def list_thresholds(active_only=False):
    """Retrieve thresholds."""
    qs = Threshold.objects.select_related('facility', 'meter').order_by('-created_at')
    if active_only:
        qs = qs.filter(active=True)
    return qs

def get_alert_by_id(alert_id):
    """Retrieve single alert."""
    return Alert.objects.select_related('threshold', 'facility', 'meter').filter(id=alert_id).first()

def list_user_notifications(user, is_read=None, severity=None, notification_type=None, limit=None):
    """Retrieve notifications scoped strictly to the given user."""
    qs = Notification.objects.filter(user=user).order_by('-created_at')
    if is_read is not None:
        qs = qs.filter(is_read=is_read)
    if severity:
        qs = qs.filter(severity=severity)
    if notification_type:
        qs = qs.filter(notification_type=notification_type)
    if limit:
        qs = qs[:limit]
    return qs

def count_unread_notifications(user):
    """Counts unread notifications for a user."""
    return Notification.objects.filter(user=user, is_read=False).count()
