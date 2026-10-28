from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import EnergyReading
from .serializers import EnergyReadingSerializer
from .selectors import list_readings, get_reading_by_id
from .services import record_energy_reading, import_readings_from_csv
from .permissions import ReadOnlyOrManagerAdmin, IsManagerOrAdmin

class EnergyReadingViewSet(viewsets.ModelViewSet):
    serializer_class = EnergyReadingSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        meter_id = self.request.query_params.get('meter')
        facility_id = self.request.query_params.get('facility')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        return list_readings(
            meter_id=meter_id,
            facility_id=facility_id,
            start_date=start_date,
            end_date=end_date
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        reading = record_energy_reading(
            meter_id=data['meter'].id,
            reading_time=data['reading_time'],
            value=data['value'],
            unit=data.get('unit'),
            source=data.get('source', 'manual'),
            created_by=request.user
        )
        return Response(self.get_serializer(reading).data, status=status.HTTP_201_CREATED)

class CSVImportView(APIView):
    permission_classes = [IsManagerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {'error': {'message': 'No CSV file provided.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            count = import_readings_from_csv(file_obj, created_by=request.user)
            return Response({
                'success': True,
                'message': f'Successfully imported {count} readings.',
                'imported_count': count
            })
        except Exception as e:
            return Response(
                {'error': {'message': f'Import failed: {str(e)}'}},
                status=status.HTTP_400_BAD_REQUEST
            )
