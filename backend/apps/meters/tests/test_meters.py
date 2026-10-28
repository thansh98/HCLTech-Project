from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.meters.services import create_meter, update_meter, delete_meter
from apps.meters.selectors import list_meters

User = get_user_model()

class MetersTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.facility = Facility.objects.create(
            name='HQ Building',
            category='commercial',
            status='active'
        )
        self.meter = Meter.objects.create(
            meter_code='MTR-001',
            facility=self.facility,
            energy_type='electricity',
            unit='kWh',
            status='active'
        )

    def test_create_meter_service(self):
        meter = create_meter(
            meter_code='MTR-002',
            facility_id=self.facility.id,
            energy_type='water',
            unit='Liters',
            acting_user=self.admin_user
        )
        self.assertEqual(meter.meter_code, 'MTR-002')
        self.assertEqual(Meter.objects.count(), 2)

    def test_list_meters_selector(self):
        meters = list_meters(energy_type='electricity')
        self.assertEqual(meters.count(), 1)
        self.assertEqual(meters.first().meter_code, 'MTR-001')

    def test_meters_api(self):
        self.client.force_authenticate(user=self.admin_user)
        # Create
        res = self.client.post('/api/meters/', {
            'meter_code': 'MTR-003',
            'facility': self.facility.id,
            'energy_type': 'gas',
            'unit': 'Therms',
            'status': 'active'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        m_id = res.data['id']

        # Update
        res = self.client.patch(f'/api/meters/{m_id}/', {'status': 'inactive'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'inactive')
