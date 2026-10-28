from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.audit.models import AuditLog
from apps.audit.services import record_audit_log
from apps.audit.selectors import list_audit_logs

User = get_user_model()

class AuditTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )

    def test_record_audit_log(self):
        log = record_audit_log(
            user=self.admin,
            action='TEST_ACTION',
            entity_name='Facility',
            entity_id='1',
            details={'test': True}
        )
        self.assertEqual(log.action, 'TEST_ACTION')
        self.assertEqual(AuditLog.objects.count(), 1)

    def test_audit_api(self):
        self.client.force_authenticate(user=self.admin)
        record_audit_log(self.admin, 'API_TEST', 'Meter', '10')
        res = self.client.get('/api/audit/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data['results']), 1)
