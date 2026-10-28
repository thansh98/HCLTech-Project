from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnergyReadingViewSet, CSVImportView

router = DefaultRouter()
router.register(r'', EnergyReadingViewSet, basename='energy_reading')

urlpatterns = [
    path('import-csv/', CSVImportView.as_view(), name='import_csv'),
    path('', include(router.urls)),
]
