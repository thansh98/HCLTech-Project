from django.db import models
from apps.facilities.models import Facility

class Meter(models.Model):
    ENERGY_TYPE_CHOICES = (
        ('electricity', 'Electricity'),
        ('water', 'Water'),
        ('gas', 'Natural Gas'),
        ('solar', 'Solar'),
    )

    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('error', 'Error State'),
    )

    meter_code = models.CharField(max_length=100, unique=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='meters')
    energy_type = models.CharField(max_length=50, choices=ENERGY_TYPE_CHOICES)
    unit = models.CharField(max_length=20)  # e.g. kWh, Liters, Therms
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.meter_code} ({self.energy_type})"
