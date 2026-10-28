from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Threshold, Alert, Notification
from .serializers import ThresholdSerializer, AlertSerializer, NotificationSerializer
from .selectors import (
    list_alerts,
    list_thresholds,
    get_alert_by_id,
    list_user_notifications,
    count_unread_notifications,
)
from .services import (
    create_threshold,
    acknowledge_alert,
    resolve_alert,
    mark_notification_as_read,
    mark_all_notifications_as_read,
)
from .permissions import ReadOnlyOrManagerAdmin

class ThresholdViewSet(viewsets.ModelViewSet):
    serializer_class = ThresholdSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        active_only = self.request.query_params.get('active_only') == 'true'
        return list_thresholds(active_only=active_only)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        th = create_threshold(
            facility_id=data.get('facility').id if data.get('facility') else None,
            meter_id=data.get('meter').id if data.get('meter') else None,
            metric=data['metric'],
            operator=data['operator'],
            value=data['value'],
            severity=data.get('severity', 'warning'),
            active=data.get('active', True),
            acting_user=request.user
        )
        return Response(self.get_serializer(th).data, status=status.HTTP_201_CREATED)

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        status_param = self.request.query_params.get('status')
        severity = self.request.query_params.get('severity')
        facility_id = self.request.query_params.get('facility')
        return list_alerts(status=status_param, severity=severity, facility_id=facility_id)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        alert = self.get_object()
        updated = acknowledge_alert(alert, acting_user=request.user)
        return Response(self.get_serializer(updated).data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        updated = resolve_alert(alert, acting_user=request.user)
        return Response(self.get_serializer(updated).data)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        is_read_param = self.request.query_params.get('is_read')
        is_read = None
        if is_read_param is not None:
            is_read = is_read_param.lower() in ('true', '1')

        severity = self.request.query_params.get('severity')
        notif_type = self.request.query_params.get('type')
        limit = self.request.query_params.get('limit')
        limit_val = int(limit) if limit and limit.isdigit() else None

        return list_user_notifications(
            user=self.request.user,
            is_read=is_read,
            severity=severity,
            notification_type=notif_type,
            limit=limit_val
        )

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        count = count_unread_notifications(request.user)
        return Response({'unread_count': count})

    @action(detail=True, methods=['patch', 'post'], url_path='read')
    def mark_read(self, request, pk=None):
        notif = mark_notification_as_read(request.user, pk)
        if not notif:
            return Response(
                {'error': {'message': 'Notification not found.'}},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(self.get_serializer(notif).data)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        updated_count = mark_all_notifications_as_read(request.user)
        return Response({'success': True, 'marked_count': updated_count})
