from rest_framework import serializers
from .models import Meter
from apps.facilities.serializers import FacilitySerializer
from apps.facilities.models import Facility

class MeterSerializer(serializers.ModelSerializer):
    facility_details = FacilitySerializer(source='facility', read_only=True)
    facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all())

    class Meta:
        model = Meter
        fields = [
            'id', 'meter_code', 'facility', 'facility_details',
            'energy_type', 'unit', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
