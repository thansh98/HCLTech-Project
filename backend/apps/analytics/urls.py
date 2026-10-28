from django.urls import path
from .views import DashboardSummaryView, EnergyTrendsView, CostAnalysisView

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='analytics_summary'),
    path('dashboard/', DashboardSummaryView.as_view(), name='analytics_dashboard'),
    path('trends/', EnergyTrendsView.as_view(), name='analytics_trends'),
    path('costs/', CostAnalysisView.as_view(), name='analytics_costs'),
]
