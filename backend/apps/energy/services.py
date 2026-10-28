import csv
import io
from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError
from common.utils import log_audit_action
from apps.meters.models import Meter
from .models import EnergyReading

def record_energy_reading(meter_id, reading_time, value, unit=None, source='manual', created_by=None):
    """Service to create an energy reading and evaluate alert thresholds."""
    meter = Meter.objects.filter(id=meter_id).first()
    if not meter:
        raise ValidationError({'meter': 'Specified meter does not exist.'})

    reading_unit = unit or meter.unit
    val_decimal = Decimal(str(value))

    reading = EnergyReading.objects.create(
        meter=meter,
        reading_time=reading_time,
        value=val_decimal,
        unit=reading_unit,
        source=source,
        created_by=created_by
    )

    log_audit_action(created_by, 'ENERGY_READING_RECORDED', 'EnergyReading', reading.id, {
        'meter_code': meter.meter_code,
        'value': str(val_decimal),
        'unit': reading_unit
    })

    # Evaluate thresholds
    try:
        from apps.alerts.services import evaluate_thresholds_for_reading
        evaluate_thresholds_for_reading(reading)
    except Exception as e:
        # Avoid breaking reading creation if alerts service has an issue
        pass

    return reading

def import_readings_from_csv(csv_file, created_by=None):
    """Parses and imports energy readings from CSV data."""
    decoded = csv_file.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    imported = []

    for row in reader:
        meter_code = row.get('Meter Code') or row.get('meter_code')
        reading_time_str = row.get('Reading Time') or row.get('reading_time')
        value_str = row.get('Value') or row.get('value')
        unit = row.get('Unit') or row.get('unit')

        if not meter_code or not reading_time_str or not value_str:
            continue

        meter = Meter.objects.filter(meter_code=meter_code).first()
        if not meter:
            continue

        reading = record_energy_reading(
            meter_id=meter.id,
            reading_time=reading_time_str,
            value=value_str,
            unit=unit or meter.unit,
            source='csv_import',
            created_by=created_by
        )
        imported.append(reading)

    return len(imported)
