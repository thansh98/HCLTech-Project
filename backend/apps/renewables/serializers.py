from rest_framework import serializers
from .models import RenewableRecord
from apps.facilities.models import Facility

class RenewableRecordSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all())

    class Meta:
        model = RenewableRecord
        fields = [
            'id', 'facility', 'facility_name', 'source_type', 'record_time',
            'generated_energy', 'unit', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
