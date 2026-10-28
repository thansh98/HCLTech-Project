from django.db import models
from apps.facilities.models import Facility

class RenewableRecord(models.Model):
    SOURCE_CHOICES = (
        ('solar', 'Solar Panels'),
        ('wind', 'Wind Turbine'),
        ('geothermal', 'Geothermal'),
        ('biomass', 'Biomass'),
    )

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='renewable_records')
    source_type = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    record_time = models.DateTimeField()
    generated_energy = models.DecimalField(max_digits=15, decimal_places=4)
    unit = models.CharField(max_length=20, default='kWh')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['facility', 'record_time']),
        ]
        ordering = ['-record_time']

    def __str__(self):
        return f"{self.source_type} at {self.facility.name} - {self.generated_energy} {self.unit}"
