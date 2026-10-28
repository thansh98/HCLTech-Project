from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.accounts.views import UserViewSet
from apps.alerts.views import NotificationViewSet

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'greengrid-backend', 'version': '2.0.0'})

users_router = DefaultRouter()
users_router.register(r'', UserViewSet, basename='users')

notifications_router = DefaultRouter()
notifications_router.register(r'', NotificationViewSet, basename='notifications')

api_v1_patterns = [
    path('auth/', include('apps.accounts.urls')),
    path('users/', include(users_router.urls)),
    path('notifications/', include(notifications_router.urls)),
    path('facilities/', include('apps.facilities.urls')),
    path('meters/', include('apps.meters.urls')),
    path('energy/', include('apps.energy.urls')),
    path('readings/', include('apps.energy.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('billing/', include('apps.billing.urls')),
    path('bills/', include('apps.billing.urls')),
    path('renewables/', include('apps.renewables.urls')),
    path('alerts/', include('apps.alerts.urls')),
    path('reports/', include('apps.reports.urls')),
    path('audit/', include('apps.audit.urls')),
    path('health/', health_check, name='health_check'),
]

urlpatterns = [
    path('health/', health_check, name='root_health_check'),
    path('admin/', admin.site.urls),
    # REST API v1 and primary /api/ endpoints
    path('api/', include(api_v1_patterns)),
    path('api/v1/', include(api_v1_patterns)),
]
