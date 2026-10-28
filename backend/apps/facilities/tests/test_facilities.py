from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.facilities.services import create_facility, update_facility, delete_facility
from apps.facilities.selectors import list_facilities

User = get_user_model()

class FacilitiesTestCase(TestCase):
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

    def test_create_facility_service(self):
        fac = create_facility(
            name='Solar Plant Alpha',
            category='industrial',
            status='active',
            acting_user=self.admin_user
        )
        self.assertEqual(fac.name, 'Solar Plant Alpha')
        self.assertEqual(Facility.objects.count(), 2)

    def test_list_facilities_selector(self):
        results = list_facilities(category='commercial')
        self.assertEqual(results.count(), 1)
        self.assertEqual(results.first().name, 'HQ Building')

    def test_facilities_api_crud(self):
        self.client.force_authenticate(user=self.admin_user)
        # Create
        res = self.client.post('/api/facilities/', {
            'name': 'Branch Office',
            'category': 'commercial',
            'status': 'active'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        fac_id = res.data['id']

        # Read
        res = self.client.get('/api/facilities/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Update
        res = self.client.patch(f'/api/facilities/{fac_id}/', {'name': 'Branch Office East'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], 'Branch Office East')

        # Delete
        res = self.client.delete(f'/api/facilities/{fac_id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
