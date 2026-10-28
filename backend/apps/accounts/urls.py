from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CurrentUserView,
    RegisterView,
    CustomTokenObtainPairView,
    UserViewSet,
    VerifyEmailView,
    ResendVerificationView,
    ForgotPasswordView,
    ResetPasswordView,
    LoginInitView,
    VerifyLoginOTPView,
    ResendLoginOTPView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('login/', LoginInitView.as_view(), name='login_init'),
    path('token/direct/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('verify-otp/', VerifyLoginOTPView.as_view(), name='verify_otp'),
    path('verify-login-otp/', VerifyLoginOTPView.as_view(), name='verify_login_otp'),
    path('resend-otp/', ResendLoginOTPView.as_view(), name='resend_otp'),
    path('register/', RegisterView.as_view(), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', ResendVerificationView.as_view(), name='resend_verification'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]
