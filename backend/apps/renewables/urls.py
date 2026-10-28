from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RenewableRecordViewSet, RenewableBreakdownView

router = DefaultRouter()
router.register(r'', RenewableRecordViewSet, basename='renewable')

urlpatterns = [
    path('breakdown/', RenewableBreakdownView.as_view(), name='renewable_breakdown'),
    path('', include(router.urls)),
]
