from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThresholdViewSet, AlertViewSet

router = DefaultRouter()
router.register(r'thresholds', ThresholdViewSet, basename='threshold')
router.register(r'history', AlertViewSet, basename='alert')

urlpatterns = [
    path('', include(router.urls)),
]
