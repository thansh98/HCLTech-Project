from rest_framework import viewsets
from .models import AuditLog
from .serializers import AuditLogSerializer
from .selectors import list_audit_logs
from .permissions import IsManagerOrAdmin

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsManagerOrAdmin]

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        entity_name = self.request.query_params.get('entity')
        action = self.request.query_params.get('action')
        return list_audit_logs(user_id=user_id, entity_name=entity_name, action=action)
