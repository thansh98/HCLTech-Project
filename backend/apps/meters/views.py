from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Meter
from .serializers import MeterSerializer
from .selectors import list_meters, get_meter_by_id
from .services import create_meter, update_meter, delete_meter
from .permissions import ReadOnlyOrManagerAdmin

class MeterViewSet(viewsets.ModelViewSet):
    serializer_class = MeterSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        facility_id = self.request.query_params.get('facility')
        energy_type = self.request.query_params.get('energy_type')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        return list_meters(user=self.request.user, facility_id=facility_id, energy_type=energy_type, status=status_param, search=search)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        meter = create_meter(
            meter_code=data['meter_code'],
            facility_id=data['facility'].id,
            energy_type=data['energy_type'],
            unit=data.get('unit', 'kWh'),
            status=data.get('status', 'active'),
            acting_user=request.user
        )
        return Response(self.get_serializer(meter).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        updated = update_meter(instance, serializer.validated_data, acting_user=request.user)
        return Response(self.get_serializer(updated).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_meter(instance, acting_user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
