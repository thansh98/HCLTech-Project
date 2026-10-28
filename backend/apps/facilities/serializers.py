from rest_framework import serializers
from .models import Facility
from apps.accounts.serializers import UserSerializer

class FacilitySerializer(serializers.ModelSerializer):
    managers = UserSerializer(many=True, read_only=True)
    manager_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    meters_count = serializers.SerializerMethodField()

    class Meta:
        model = Facility
        fields = [
            'id', 'name', 'category', 'status', 'location_description',
            'managers', 'manager_ids', 'meters_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_meters_count(self, obj):
        return getattr(obj, 'meters', None).count() if hasattr(obj, 'meters') else 0
