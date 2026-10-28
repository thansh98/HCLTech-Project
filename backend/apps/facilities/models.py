from django.db import models
from django.conf import settings

class Facility(models.Model):
    CATEGORY_CHOICES = (
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
        ('residential', 'Residential'),
        ('campus', 'Campus'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
    )

    name = models.CharField(max_length=255)
    location_description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    
    # Manager/Owner of the facility
    managers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='managed_facilities', blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
