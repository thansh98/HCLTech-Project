from django.db import models
from django.conf import settings
from apps.facilities.models import Facility
from apps.meters.models import Meter

class Threshold(models.Model):
    OPERATOR_CHOICES = (
        ('gt', 'Greater Than'),
        ('lt', 'Less Than'),
        ('eq', 'Equal To'),
        ('gte', 'Greater Than or Equal'),
        ('lte', 'Less Than or Equal'),
    )

    SEVERITY_CHOICES = (
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    )

    METRIC_CHOICES = (
        ('consumption', 'Energy Consumption'),
        ('cost', 'Cost Amount'),
        ('demand', 'Peak Demand'),
    )

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='thresholds', null=True, blank=True)
    meter = models.ForeignKey(Meter, on_delete=models.CASCADE, related_name='thresholds', null=True, blank=True)
    
    metric = models.CharField(max_length=50, choices=METRIC_CHOICES)
    operator = models.CharField(max_length=10, choices=OPERATOR_CHOICES)
    value = models.DecimalField(max_digits=15, decimal_places=4)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='warning')
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        target = self.meter if self.meter else self.facility
        return f"{target} {self.metric} {self.operator} {self.value}"

class Alert(models.Model):
    STATUS_CHOICES = (
        ('new', 'New'),
        ('acknowledged', 'Acknowledged'),
        ('resolved', 'Resolved'),
    )

    threshold = models.ForeignKey(Threshold, on_delete=models.SET_NULL, null=True, related_name='alerts')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    meter = models.ForeignKey(Meter, on_delete=models.CASCADE, related_name='alerts', null=True, blank=True)
    
    severity = models.CharField(max_length=20, choices=Threshold.SEVERITY_CHOICES)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    generated_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-generated_at']

    def __str__(self):
        return f"{self.severity.upper()}: {self.message}"

class Notification(models.Model):
    SEVERITY_CHOICES = (
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    )

    TYPE_CHOICES = (
        ('energy_alert', 'Energy Consumption Alert'),
        ('threshold_exceeded', 'Threshold Exceeded'),
        ('meter_offline', 'Smart Meter Offline'),
        ('meter_online', 'Smart Meter Online'),
        ('reading_received', 'New Meter Reading'),
        ('renewable_update', 'Renewable Generation Update'),
        ('billing_alert', 'Billing Alert'),
        ('report_generated', 'Report Generated'),
        ('system', 'System Notification'),
        ('security', 'Account/Security Notification'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='system')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    related_link = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"[{self.severity.upper()}] {self.title} for {self.user.username}"
