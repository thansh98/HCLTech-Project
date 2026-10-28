from django.db import models
from django.conf import settings
from apps.meters.models import Meter

class EnergyReading(models.Model):
    SOURCE_CHOICES = (
        ('manual', 'Manual Entry'),
        ('smart_meter', 'Smart Meter Telemetry'),
        ('csv_import', 'CSV Import'),
    )

    meter = models.ForeignKey(Meter, on_delete=models.CASCADE, related_name='readings')
    reading_time = models.DateTimeField()
    value = models.DecimalField(max_digits=15, decimal_places=4)
    unit = models.CharField(max_length=20)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default='manual')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['meter', 'reading_time']),
        ]
        ordering = ['-reading_time']

    def __str__(self):
        return f"{self.meter.meter_code} - {self.value} {self.unit} @ {self.reading_time}"
