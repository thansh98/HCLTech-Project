import csv
import io
from .selectors import get_exportable_readings

def generate_readings_csv_buffer(meter_id=None, facility_id=None, start_date=None, end_date=None):
    """Generates a CSV string buffer for energy readings."""
    readings = get_exportable_readings(meter_id=meter_id, facility_id=facility_id, start_date=start_date, end_date=end_date)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(['Meter Code', 'Facility', 'Reading Time', 'Value', 'Unit', 'Source'])

    for r in readings:
        writer.writerow([
            r.meter.meter_code,
            r.meter.facility.name if r.meter.facility else '',
            r.reading_time.strftime('%Y-%m-%d %H:%M:%S'),
            r.value,
            r.unit,
            r.source
        ])

    buffer.seek(0)
    return buffer
