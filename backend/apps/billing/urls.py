from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UtilityBillViewSet

router = DefaultRouter()
router.register(r'', UtilityBillViewSet, basename='utility_bill')

urlpatterns = [
    path('', include(router.urls)),
]
