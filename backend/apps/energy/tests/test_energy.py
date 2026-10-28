from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.energy.models import EnergyReading
from apps.energy.services import record_energy_reading
from apps.energy.selectors import list_readings, get_total_consumption

User = get_user_model()

class EnergyTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.facility = Facility.objects.create(name='Main Plant', category='industrial')
        self.meter = Meter.objects.create(
            meter_code='EL-001',
            facility=self.facility,
            energy_type='electricity',
            unit='kWh'
        )

    def test_record_reading_service(self):
        reading = record_energy_reading(
            meter_id=self.meter.id,
            reading_time=timezone.now(),
            value='150.50',
            source='manual',
            created_by=self.admin
        )
        self.assertEqual(float(reading.value), 150.5)
        self.assertEqual(EnergyReading.objects.count(), 1)

    def test_selectors(self):
        record_energy_reading(
            meter_id=self.meter.id,
            reading_time=timezone.now(),
            value='200.00',
            created_by=self.admin
        )
        readings = list_readings(meter_id=self.meter.id)
        self.assertEqual(readings.count(), 1)
        total = get_total_consumption(facility_id=self.facility.id)
        self.assertEqual(total, 200.0)

    def test_energy_api(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/energy/', {
            'meter': self.meter.id,
            'reading_time': timezone.now().isoformat(),
            'value': '85.25',
            'unit': 'kWh',
            'source': 'manual'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(res.data['value']), 85.25)
