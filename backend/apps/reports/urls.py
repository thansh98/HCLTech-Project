from django.urls import path
from .views import ExportReadingsView, ReportsSummaryView

urlpatterns = [
    path('export/readings/', ExportReadingsView.as_view(), name='export_readings'),
    path('summary/', ReportsSummaryView.as_view(), name='reports_summary'),
]
