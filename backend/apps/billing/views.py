from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import UtilityBill
from .serializers import UtilityBillSerializer
from .selectors import list_bills, get_bill_by_id
from .services import create_bill, update_bill, delete_bill
from .permissions import ReadOnlyOrManagerAdmin

class UtilityBillViewSet(viewsets.ModelViewSet):
    serializer_class = UtilityBillSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        facility_id = self.request.query_params.get('facility')
        status_param = self.request.query_params.get('status')
        provider = self.request.query_params.get('provider')
        return list_bills(facility_id=facility_id, status=status_param, provider=provider)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        bill = create_bill(
            facility_id=data['facility'].id,
            provider=data['provider'],
            period_start=data['period_start'],
            period_end=data['period_end'],
            units=data['units'],
            amount=data['amount'],
            due_date=data['due_date'],
            status=data.get('status', 'pending'),
            acting_user=request.user
        )
        return Response(self.get_serializer(bill).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        updated = update_bill(instance, serializer.validated_data, acting_user=request.user)
        return Response(self.get_serializer(updated).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_bill(instance, acting_user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
