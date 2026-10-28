from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Facility
from .serializers import FacilitySerializer
from .selectors import list_facilities, get_facility_by_id
from .services import create_facility, update_facility, delete_facility
from .permissions import ReadOnlyOrManagerAdmin

class FacilityViewSet(viewsets.ModelViewSet):
    serializer_class = FacilitySerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        return list_facilities(user=self.request.user, category=category, status=status_param, search=search)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        facility = create_facility(
            name=data['name'],
            category=data['category'],
            status=data.get('status', 'active'),
            location_description=data.get('location_description', ''),
            manager_ids=data.get('manager_ids', []),
            acting_user=request.user
        )
        return Response(self.get_serializer(facility).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        updated = update_facility(instance, serializer.validated_data, acting_user=request.user)
        return Response(self.get_serializer(updated).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_facility(instance, acting_user=request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
