from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.billing.models import UtilityBill
from apps.billing.services import create_bill, update_bill
from apps.billing.selectors import list_bills

User = get_user_model()

class BillingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.facility = Facility.objects.create(name='Factory 1', category='industrial')

    def test_create_bill_service(self):
        bill = create_bill(
            facility_id=self.facility.id,
            provider='Grid Energy Co',
            period_start=date(2026, 1, 1),
            period_end=date(2026, 1, 31),
            units='12000.00',
            amount='1850.50',
            due_date=date(2026, 2, 15),
            status='pending',
            acting_user=self.admin
        )
        self.assertEqual(float(bill.amount), 1850.5)
        self.assertEqual(UtilityBill.objects.count(), 1)

    def test_billing_api(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post('/api/billing/', {
            'facility': self.facility.id,
            'provider': 'CleanPower Ltd',
            'period_start': '2026-02-01',
            'period_end': '2026-02-28',
            'units': '8000.00',
            'amount': '1200.00',
            'due_date': '2026-03-15',
            'status': 'pending'
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        b_id = res.data['id']

        # Update to paid
        res = self.client.patch(f'/api/billing/{b_id}/', {'status': 'paid'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'paid')
