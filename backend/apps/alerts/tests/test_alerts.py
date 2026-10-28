from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.energy.models import EnergyReading
from apps.alerts.models import Threshold, Alert, Notification
from apps.alerts.services import (
    create_threshold,
    evaluate_thresholds_for_reading,
    acknowledge_alert,
    resolve_alert,
    create_notification,
    mark_notification_as_read,
    mark_all_notifications_as_read,
)

User = get_user_model()

class AlertsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.facility = Facility.objects.create(name='Distribution Center', category='commercial')
        self.meter = Meter.objects.create(
            meter_code='DC-01',
            facility=self.facility,
            energy_type='electricity',
            unit='kWh'
        )

    def test_threshold_breach_generates_alert(self):
        th = create_threshold(
            facility_id=self.facility.id,
            metric='consumption',
            operator='gt',
            value='100.0',
            severity='critical',
            acting_user=self.admin
        )
        reading = EnergyReading.objects.create(
            meter=self.meter,
            reading_time=timezone.now(),
            value='120.5',
            unit='kWh'
        )
        alerts = evaluate_thresholds_for_reading(reading)
        self.assertEqual(len(alerts), 1)
        self.assertEqual(alerts[0].severity, 'critical')
        self.assertEqual(alerts[0].status, 'new')

    def test_acknowledge_and_resolve_alert(self):
        alert = Alert.objects.create(
            facility=self.facility,
            meter=self.meter,
            severity='warning',
            message='Test Alert',
            status='new'
        )
        ack = acknowledge_alert(alert, acting_user=self.admin)
        self.assertEqual(ack.status, 'acknowledged')

        res = resolve_alert(alert, acting_user=self.admin)
        self.assertEqual(res.status, 'resolved')
        self.assertIsNotNone(res.resolved_at)

    def test_alert_api_actions(self):
        self.client.force_authenticate(user=self.admin)
        alert = Alert.objects.create(
            facility=self.facility,
            severity='warning',
            message='High load detected',
            status='new'
        )
        res = self.client.post(f'/api/alerts/history/{alert.id}/acknowledge/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'acknowledged')

    def test_notification_creation_and_api(self):
        # Create notifications for admin
        n1 = create_notification(
            user=self.admin,
            title='Test Critical Alert',
            message='Facility load breached threshold',
            notification_type='energy_alert',
            severity='critical',
            related_link='/dashboard/alerts'
        )
        n2 = create_notification(
            user=self.admin,
            title='Test Warning Alert',
            message='Battery capacity low',
            notification_type='energy_alert',
            severity='warning'
        )

        # Another user's notification
        viewer_user = User.objects.create_user(
            username='viewer_test',
            email='viewer_test@example.com',
            password='password123',
            role='viewer'
        )
        create_notification(
            user=viewer_user,
            title='Viewer Alert',
            message='Viewer notification',
            notification_type='system',
            severity='info'
        )

        self.client.force_authenticate(user=self.admin)

        # Check unread count endpoint
        count_res = self.client.get('/api/notifications/unread-count/')
        self.assertEqual(count_res.status_code, status.HTTP_200_OK)
        self.assertEqual(count_res.data['unread_count'], 2)

        # Check list endpoint only returns admin's notifications
        list_res = self.client.get('/api/notifications/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get('results', list_res.data)
        self.assertEqual(len(results), 2)

        # Mark single notification as read
        read_res = self.client.post(f'/api/notifications/{n1.id}/read/')
        self.assertEqual(read_res.status_code, status.HTTP_200_OK)
        self.assertTrue(read_res.data['is_read'])

        count_res2 = self.client.get('/api/notifications/unread-count/')
        self.assertEqual(count_res2.data['unread_count'], 1)

        # Mark all notifications as read
        mark_all_res = self.client.post('/api/notifications/mark-all-read/')
        self.assertEqual(mark_all_res.status_code, status.HTTP_200_OK)
        self.assertEqual(mark_all_res.data['marked_count'], 1)

        count_res3 = self.client.get('/api/notifications/unread-count/')
        self.assertEqual(count_res3.data['unread_count'], 0)

    def test_threshold_breach_generates_notifications(self):
        th = create_threshold(
            facility_id=self.facility.id,
            metric='consumption',
            operator='gt',
            value='100.0',
            severity='critical',
            acting_user=self.admin
        )
        reading = EnergyReading.objects.create(
            meter=self.meter,
            reading_time=timezone.now(),
            value='150.0',
            unit='kWh'
        )
        alerts = evaluate_thresholds_for_reading(reading)
        self.assertEqual(len(alerts), 1)

        # Check admin user received notification
        notifs = Notification.objects.filter(user=self.admin)
        self.assertTrue(notifs.exists())
        self.assertEqual(notifs.first().severity, 'critical')
        self.assertIn('Consumption threshold exceeded', notifs.first().message)

