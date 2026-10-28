from rest_framework import serializers
from .models import EnergyReading
from apps.meters.models import Meter

class MeterBriefSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)

    class Meta:
        model = Meter
        fields = ['id', 'meter_code', 'energy_type', 'unit', 'facility', 'facility_name']

class EnergyReadingSerializer(serializers.ModelSerializer):
    meter_details = MeterBriefSerializer(source='meter', read_only=True)
    meter = serializers.PrimaryKeyRelatedField(queryset=Meter.objects.all())
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = EnergyReading
        fields = [
            'id', 'meter', 'meter_details', 'reading_time', 'value',
            'unit', 'source', 'created_by', 'created_by_username', 'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']
