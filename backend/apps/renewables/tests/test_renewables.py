from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.renewables.models import RenewableRecord
from apps.renewables.services import record_renewable_generation
from apps.renewables.selectors import list_renewable_records, get_renewable_breakdown

User = get_user_model()

class RenewablesTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.facility = Facility.objects.create(name='Solar Park 1', category='industrial')

    def test_record_generation_service(self):
        rec = record_renewable_generation(
            facility_id=self.facility.id,
            source_type='solar',
            record_time=timezone.now(),
            generated_energy='320.5',
            acting_user=self.admin
        )
        self.assertEqual(float(rec.generated_energy), 320.5)
        self.assertEqual(RenewableRecord.objects.count(), 1)

    def test_breakdown_selector(self):
        record_renewable_generation(
            facility_id=self.facility.id,
            source_type='solar',
            record_time=timezone.now(),
            generated_energy='400.0',
            acting_user=self.admin
        )
        breakdown = get_renewable_breakdown(facility_id=self.facility.id)
        solar = next(item for item in breakdown if item['source_type'] == 'solar')
        self.assertEqual(solar['total_kwh'], 400.0)

    def test_renewables_api(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/renewables/', {
            'facility': self.facility.id,
            'source_type': 'wind',
            'record_time': timezone.now().isoformat(),
            'generated_energy': '250.00',
            'unit': 'kWh'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(res.data['generated_energy']), 250.0)
