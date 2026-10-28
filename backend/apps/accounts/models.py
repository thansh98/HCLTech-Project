from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('manager', 'Energy/Facility Manager'),
        ('viewer', 'Viewer/Authorized User'),
    )
    email = models.EmailField(unique=True, max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    
    # Email verification fields
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=128, blank=True, null=True, db_index=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)

    # Password reset fields
    password_reset_token = models.CharField(max_length=128, blank=True, null=True, db_index=True)
    password_reset_sent_at = models.DateTimeField(blank=True, null=True)

    # Login OTP fields
    login_otp = models.CharField(max_length=6, blank=True, null=True)
    login_otp_created_at = models.DateTimeField(blank=True, null=True)
    login_otp_attempts = models.PositiveSmallIntegerField(default=0)
    login_session_token = models.CharField(max_length=128, blank=True, null=True, db_index=True)

    def __str__(self):
        return f"{self.username} ({self.email}) - {self.role}"

