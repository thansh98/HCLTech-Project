from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.energy.models import EnergyReading
from apps.renewables.models import RenewableRecord
from apps.analytics.selectors import get_dashboard_summary, get_consumption_trends

User = get_user_model()

class AnalyticsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='analyst',
            email='analyst@example.com',
            password='password123',
            role='viewer'
        )
        self.facility = Facility.objects.create(name='Solar HQ', category='commercial')
        self.meter = Meter.objects.create(
            meter_code='HQ-M1',
            facility=self.facility,
            energy_type='electricity',
            unit='kWh'
        )
        EnergyReading.objects.create(
            meter=self.meter,
            reading_time=timezone.now(),
            value='500.0',
            unit='kWh'
        )
        RenewableRecord.objects.create(
            facility=self.facility,
            source_type='solar',
            record_time=timezone.now(),
            generated_energy='150.0',
            unit='kWh'
        )

    def test_dashboard_summary_selector(self):
        data = get_dashboard_summary()
        self.assertEqual(data['total_consumption_kwh'], 500.0)
        self.assertEqual(data['total_renewable_kwh'], 150.0)
        self.assertEqual(data['renewable_percentage'], 30.0)

    def test_trends_selector(self):
        trends = get_consumption_trends(days=7)
        self.assertEqual(len(trends['labels']), 7)
        self.assertGreaterEqual(sum(trends['consumption']), 500.0)

    def test_analytics_api(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/analytics/summary/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['total_consumption_kwh'], 500.0)
