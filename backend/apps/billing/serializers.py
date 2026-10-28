from rest_framework import serializers
from .models import UtilityBill
from apps.facilities.models import Facility

class UtilityBillSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    facility = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all())

    class Meta:
        model = UtilityBill
        fields = [
            'id', 'facility', 'facility_name', 'provider', 'period_start',
            'period_end', 'units', 'amount', 'due_date', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
