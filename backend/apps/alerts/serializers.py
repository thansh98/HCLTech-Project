from rest_framework import serializers
from .models import Threshold, Alert, Notification
from apps.facilities.models import Facility
from apps.meters.models import Meter

class ThresholdSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    meter_code = serializers.CharField(source='meter.meter_code', read_only=True)
    facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), required=False, allow_null=True)
    meter = serializers.PrimaryKeyRelatedField(queryset=Meter.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Threshold
        fields = [
            'id', 'facility', 'facility_name', 'meter', 'meter_code',
            'metric', 'operator', 'value', 'severity', 'active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AlertSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    meter_code = serializers.CharField(source='meter.meter_code', read_only=True)

    class Meta:
        model = Alert
        fields = [
            'id', 'threshold', 'facility', 'facility_name', 'meter',
            'meter_code', 'severity', 'message', 'status',
            'generated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'generated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'severity', 'is_read', 'related_link', 'created_at'
        ]
        read_only_fields = ['id', 'title', 'message', 'notification_type', 'severity', 'related_link', 'created_at']
