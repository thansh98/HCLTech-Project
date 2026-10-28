from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import generate_readings_csv_buffer
from apps.analytics.selectors import get_dashboard_summary

class ExportReadingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        meter_id = request.query_params.get('meter')
        facility_id = request.query_params.get('facility')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        buffer = generate_readings_csv_buffer(
            meter_id=meter_id,
            facility_id=facility_id,
            start_date=start_date,
            end_date=end_date
        )

        response = HttpResponse(buffer.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="energy_readings.csv"'
        return response

class ReportsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        facility_id = request.query_params.get('facility')
        summary = get_dashboard_summary(facility_id=facility_id)
        return Response({
            'report_name': 'Executive Energy Summary',
            'facility_id': facility_id,
            'summary': summary
        })
