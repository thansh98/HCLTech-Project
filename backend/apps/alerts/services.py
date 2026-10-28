from decimal import Decimal
from django.utils import timezone
from django.contrib.auth import get_user_model
from common.utils import log_audit_action
from apps.facilities.models import Facility
from apps.meters.models import Meter
from .models import Threshold, Alert, Notification

User = get_user_model()

def create_notification(user, title, message, notification_type='system', severity='info', related_link=None):
    """Creates a notification for a user."""
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        severity=severity,
        related_link=related_link,
        is_read=False
    )

def notify_users_for_alert(alert):
    """Notifies facility managers and administrators about a triggered alert."""
    target_users = set()

    # Facility managers
    if alert.facility:
        for mgr in alert.facility.managers.all():
            target_users.add(mgr)

    # All admins
    for admin_user in User.objects.filter(role='admin', is_active=True):
        target_users.add(admin_user)

    # If empty, notify any active staff
    if not target_users:
        for u in User.objects.filter(is_active=True)[:3]:
            target_users.add(u)

    title = f"Alert: {alert.threshold.get_metric_display() if alert.threshold else 'Facility Anomaly'}"
    target_name = alert.meter.meter_code if alert.meter else (alert.facility.name if alert.facility else 'Facility')
    msg = f"Threshold breached on {target_name}: {alert.message}"

    for u in target_users:
        create_notification(
            user=u,
            title=title,
            message=msg,
            notification_type='energy_alert',
            severity=alert.severity,
            related_link='/alerts'
        )

def create_threshold(metric, operator, value, facility_id=None, meter_id=None, severity='warning', active=True, acting_user=None):
    """Service to create an alert threshold."""
    facility = Facility.objects.filter(id=facility_id).first() if facility_id else None
    meter = Meter.objects.filter(id=meter_id).first() if meter_id else None

    threshold = Threshold.objects.create(
        facility=facility,
        meter=meter,
        metric=metric,
        operator=operator,
        value=Decimal(str(value)),
        severity=severity,
        active=active
    )
    log_audit_action(acting_user, 'THRESHOLD_CREATED', 'Threshold', threshold.id, {
        'metric': metric,
        'operator': operator,
        'value': str(value),
        'severity': severity
    })
    return threshold

def evaluate_thresholds_for_reading(reading):
    """Evaluates active thresholds against a newly recorded energy reading."""
    thresholds = Threshold.objects.filter(
        active=True,
        metric='consumption'
    )
    reading_val = Decimal(str(reading.value))
    created_alerts = []

    for th in thresholds:
        # Check matching meter or facility
        if th.meter_id and th.meter_id != reading.meter_id:
            continue
        if th.facility_id and th.facility_id != reading.meter.facility_id:
            continue

        th_val = th.value
        breached = False

        if th.operator == 'gt' and reading_val > th_val:
            breached = True
        elif th.operator == 'gte' and reading_val >= th_val:
            breached = True
        elif th.operator == 'lt' and reading_val < th_val:
            breached = True
        elif th.operator == 'lte' and reading_val <= th_val:
            breached = True
        elif th.operator == 'eq' and reading_val == th_val:
            breached = True

        if breached:
            msg = (
                f"Consumption threshold exceeded on meter {reading.meter.meter_code}: "
                f"{reading_val} {reading.unit} ({th.operator} {th_val} {th.metric})"
            )
            alert = Alert.objects.create(
                threshold=th,
                facility=reading.meter.facility,
                meter=reading.meter,
                severity=th.severity,
                message=msg,
                status='new'
            )
            created_alerts.append(alert)
            log_audit_action(None, 'ALERT_TRIGGERED', 'Alert', alert.id, {'message': msg, 'severity': th.severity})
            notify_users_for_alert(alert)

    return created_alerts

def acknowledge_alert(alert, acting_user=None):
    """Marks an alert as acknowledged."""
    alert.status = 'acknowledged'
    alert.save(update_fields=['status'])
    log_audit_action(acting_user, 'ALERT_ACKNOWLEDGED', 'Alert', alert.id)
    return alert

def resolve_alert(alert, acting_user=None):
    """Marks an alert as resolved."""
    alert.status = 'resolved'
    alert.resolved_at = timezone.now()
    alert.save(update_fields=['status', 'resolved_at'])
    log_audit_action(acting_user, 'ALERT_RESOLVED', 'Alert', alert.id)
    return alert

def mark_notification_as_read(user, notification_id):
    """Marks a single notification as read."""
    notif = Notification.objects.filter(id=notification_id, user=user).first()
    if notif and not notif.is_read:
        notif.is_read = True
        notif.save(update_fields=['is_read'])
    return notif

def mark_all_notifications_as_read(user):
    """Marks all unread notifications for a user as read."""
    count = Notification.objects.filter(user=user, is_read=False).update(is_read=True)
    return count
