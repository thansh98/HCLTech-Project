import random
from datetime import timedelta, date
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.facilities.models import Facility
from apps.meters.models import Meter
from apps.energy.models import EnergyReading
from apps.renewables.models import RenewableRecord
from apps.billing.models import UtilityBill
from apps.alerts.models import Threshold, Alert, Notification
from apps.audit.models import AuditLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds GreenGrid with comprehensive initial development data.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')

        # 1. Users
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@greengrid.io',
                'first_name': 'Eleanor',
                'last_name': 'Vance',
                'role': 'admin',
                'is_email_verified': True,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin.set_password('admin123')
        admin.is_email_verified = True
        admin.save()

        manager, _ = User.objects.get_or_create(
            username='manager',
            defaults={
                'email': 'manager@greengrid.io',
                'first_name': 'Marcus',
                'last_name': 'Reed',
                'role': 'manager',
                'is_email_verified': True,
            }
        )
        manager.set_password('manager123')
        manager.is_email_verified = True
        manager.save()

        viewer, _ = User.objects.get_or_create(
            username='viewer',
            defaults={
                'email': 'viewer@greengrid.io',
                'first_name': 'Aria',
                'last_name': 'Chen',
                'role': 'viewer',
                'is_email_verified': True,
            }
        )
        viewer.set_password('viewer123')
        viewer.is_email_verified = True
        viewer.save()

        self.stdout.write(self.style.SUCCESS('Users created (admin, manager, viewer) with email verification.'))

        # 2. Facilities
        fac1, _ = Facility.objects.get_or_create(
            name='HQ Technology Campus',
            defaults={
                'category': 'commercial',
                'status': 'active',
                'location_description': 'Innovation Way, Sector 4, Silicon Valley'
            }
        )
        fac1.managers.add(manager)

        fac2, _ = Facility.objects.get_or_create(
            name='North Wind & Solar Farm',
            defaults={
                'category': 'industrial',
                'status': 'active',
                'location_description': 'Highland Ridge, Block B, Northern Plains'
            }
        )
        fac2.managers.add(manager)

        fac3, _ = Facility.objects.get_or_create(
            name='Green Residences Eco-Complex',
            defaults={
                'category': 'residential',
                'status': 'active',
                'location_description': 'Meadowlands Green Corridor, Building 1-4'
            }
        )

        self.stdout.write(self.style.SUCCESS('Facilities created.'))

        # 3. Meters
        m1, _ = Meter.objects.get_or_create(
            meter_code='HQ-MAIN-ELE',
            defaults={
                'facility': fac1,
                'energy_type': 'electricity',
                'unit': 'kWh',
                'status': 'active'
            }
        )
        m2, _ = Meter.objects.get_or_create(
            meter_code='HQ-HVAC-ELE',
            defaults={
                'facility': fac1,
                'energy_type': 'electricity',
                'unit': 'kWh',
                'status': 'active'
            }
        )
        m3, _ = Meter.objects.get_or_create(
            meter_code='NW-GRID-01',
            defaults={
                'facility': fac2,
                'energy_type': 'electricity',
                'unit': 'kWh',
                'status': 'active'
            }
        )
        m4, _ = Meter.objects.get_or_create(
            meter_code='RES-WTR-MAIN',
            defaults={
                'facility': fac3,
                'energy_type': 'water',
                'unit': 'Liters',
                'status': 'active'
            }
        )

        self.stdout.write(self.style.SUCCESS('Meters created.'))

        # 4. Energy Readings & Renewables over last 7 days
        now = timezone.now()
        for i in range(7):
            day_dt = now - timedelta(days=i)
            # Consumption readings for HQ Main
            EnergyReading.objects.get_or_create(
                meter=m1,
                reading_time=day_dt.replace(hour=14, minute=0, second=0),
                defaults={
                    'value': Decimal(str(random.randint(1800, 2400))),
                    'unit': 'kWh',
                    'source': 'smart_meter',
                    'created_by': admin
                }
            )
            # Consumption for HVAC
            EnergyReading.objects.get_or_create(
                meter=m2,
                reading_time=day_dt.replace(hour=15, minute=30, second=0),
                defaults={
                    'value': Decimal(str(random.randint(600, 950))),
                    'unit': 'kWh',
                    'source': 'smart_meter',
                    'created_by': admin
                }
            )
            # Solar generation at HQ
            RenewableRecord.objects.get_or_create(
                facility=fac1,
                source_type='solar',
                record_time=day_dt.replace(hour=13, minute=0, second=0),
                defaults={
                    'generated_energy': Decimal(str(random.randint(750, 1100))),
                    'unit': 'kWh'
                }
            )
            # Wind generation at North Farm
            RenewableRecord.objects.get_or_create(
                facility=fac2,
                source_type='wind',
                record_time=day_dt.replace(hour=18, minute=0, second=0),
                defaults={
                    'generated_energy': Decimal(str(random.randint(1400, 2200))),
                    'unit': 'kWh'
                }
            )

        self.stdout.write(self.style.SUCCESS('Readings & Renewable history generated.'))

        # 5. Thresholds & Alerts
        th1, _ = Threshold.objects.get_or_create(
            facility=fac1,
            metric='consumption',
            operator='gt',
            value=Decimal('2200.00'),
            defaults={'severity': 'critical', 'active': True}
        )
        th2, _ = Threshold.objects.get_or_create(
            facility=fac1,
            metric='consumption',
            operator='gt',
            value=Decimal('1800.00'),
            defaults={'severity': 'warning', 'active': True}
        )

        Alert.objects.get_or_create(
            threshold=th1,
            facility=fac1,
            meter=m1,
            message='Peak demand exceeded: HQ Main recorded 2380 kWh load.',
            defaults={
                'severity': 'critical',
                'status': 'new'
            }
        )
        Alert.objects.get_or_create(
            threshold=th2,
            facility=fac1,
            meter=m2,
            message='HVAC load threshold exceeded during peak temperature.',
            defaults={
                'severity': 'warning',
                'status': 'acknowledged'
            }
        )

        self.stdout.write(self.style.SUCCESS('Thresholds & Alerts created.'))

        # 6. Utility Bills
        UtilityBill.objects.get_or_create(
            facility=fac1,
            provider='Pacific Clean Energy Grid',
            period_start=date(2026, 1, 1),
            period_end=date(2026, 1, 31),
            defaults={
                'units': Decimal('64200.00'),
                'amount': Decimal('8980.50'),
                'due_date': date(2026, 2, 20),
                'status': 'paid'
            }
        )
        UtilityBill.objects.get_or_create(
            facility=fac1,
            provider='Pacific Clean Energy Grid',
            period_start=date(2026, 2, 1),
            period_end=date(2026, 2, 28),
            defaults={
                'units': Decimal('58900.00'),
                'amount': Decimal('8240.00'),
                'due_date': date(2026, 3, 20),
                'status': 'pending'
            }
        )

        # 8. Notifications
        n1, _ = Notification.objects.get_or_create(
            user=admin,
            title='High Energy Consumption Detected',
            defaults={
                'message': 'Facility HQ Technology Campus exceeded peak threshold. Load: 2380 kWh.',
                'notification_type': 'energy_alert',
                'severity': 'critical',
                'is_read': False,
                'related_link': '/alerts'
            }
        )
        n1.is_read = False
        n1.save()

        n2, _ = Notification.objects.get_or_create(
            user=admin,
            title='Smart Meter Connected',
            defaults={
                'message': 'Smart Meter HQ-MAIN-ELE telemetry stream online with sub-second sync.',
                'notification_type': 'meter_online',
                'severity': 'success',
                'is_read': False,
                'related_link': '/meters'
            }
        )
        n2.is_read = False
        n2.save()

        n3, _ = Notification.objects.get_or_create(
            user=admin,
            title='Renewable Generation Peak',
            defaults={
                'message': 'Solar PV array at HQ recorded 1,100 kWh generation, offsetting 64% facility demand.',
                'notification_type': 'renewable_update',
                'severity': 'info',
                'is_read': False,
                'related_link': '/renewables'
            }
        )
        n3.is_read = False
        n3.save()

        n4, _ = Notification.objects.get_or_create(
            user=manager,
            title='Utility Tariff Billing Due',
            defaults={
                'message': 'Pacific Clean Energy Grid utility bill is due in 5 days.',
                'notification_type': 'billing_alert',
                'severity': 'warning',
                'is_read': False,
                'related_link': '/billing'
            }
        )
        n4.is_read = False
        n4.save()
        self.stdout.write(self.style.SUCCESS('Notifications seeded.'))

        self.stdout.write(self.style.SUCCESS('GreenGrid data seeded successfully!'))
