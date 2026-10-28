from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.energy.models import EnergyReading

User = get_user_model()

class ReportsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='viewer',
            email='viewer@example.com',
            password='password123',
            role='viewer'
        )
        self.facility = Facility.objects.create(name='Distribution Center', category='commercial')
        self.meter = Meter.objects.create(
            meter_code='DC-MTR-01',
            facility=self.facility,
            energy_type='electricity',
            unit='kWh'
        )
        EnergyReading.objects.create(
            meter=self.meter,
            reading_time=timezone.now(),
            value='350.00',
            unit='kWh'
        )

    def test_export_csv_api(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/reports/export/readings/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res['Content-Type'], 'text/csv')
        content = res.content.decode('utf-8')
        self.assertIn('Meter Code', content)
        self.assertIn('DC-MTR-01', content)
