from django.db import models
from apps.facilities.models import Facility

class UtilityBill(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='bills')
    provider = models.CharField(max_length=255)
    period_start = models.DateField()
    period_end = models.DateField()
    units = models.DecimalField(max_digits=15, decimal_places=4, help_text="Total energy units billed (e.g. kWh)")
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text="Total cost amount")
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.provider} Bill for {self.facility.name} ({self.period_start} to {self.period_end})"
