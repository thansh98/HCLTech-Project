from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .selectors import get_dashboard_summary, get_consumption_trends, get_cost_analysis

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        facility_id = request.query_params.get('facility')
        data = get_dashboard_summary(user=request.user, facility_id=facility_id)
        return Response(data)

class EnergyTrendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        days = int(request.query_params.get('days', 7))
        facility_id = request.query_params.get('facility')
        data = get_consumption_trends(user=request.user, days=days, facility_id=facility_id)
        return Response(data)

class CostAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        facility_id = request.query_params.get('facility')
        data = get_cost_analysis(user=request.user, facility_id=facility_id)
        return Response(data)
