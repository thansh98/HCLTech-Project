from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RenewableRecord
from .serializers import RenewableRecordSerializer
from .selectors import list_renewable_records, get_renewable_breakdown
from .services import record_renewable_generation, delete_renewable_record
from .permissions import ReadOnlyOrManagerAdmin

class RenewableRecordViewSet(viewsets.ModelViewSet):
    serializer_class = RenewableRecordSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        facility_id = self.request.query_params.get('facility')
        source_type = self.request.query_params.get('source_type')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        return list_renewable_records(
            facility_id=facility_id,
            source_type=source_type,
            start_date=start_date,
            end_date=end_date
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        record = record_renewable_generation(
            facility_id=data['facility'].id,
            source_type=data['source_type'],
            record_time=data['record_time'],
            generated_energy=data['generated_energy'],
            unit=data.get('unit', 'kWh'),
            acting_user=request.user
        )
        return Response(self.get_serializer(record).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_renewable_record(instance, acting_user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class RenewableBreakdownView(APIView):
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get(self, request):
        facility_id = request.query_params.get('facility')
        data = get_renewable_breakdown(facility_id=facility_id)
        return Response(data)
