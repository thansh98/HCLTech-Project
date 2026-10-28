from rest_framework import serializers

class DashboardSummarySerializer(serializers.Serializer):
    total_consumption_kwh = serializers.FloatField()
    total_renewable_kwh = serializers.FloatField()
    renewable_percentage = serializers.FloatField()
    total_cost = serializers.FloatField()
    active_alerts = serializers.IntegerField()
    active_facilities = serializers.IntegerField()
    active_meters = serializers.IntegerField()
