from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from common.permissions import IsAdmin, ReadOnlyOrManagerAdmin
from .serializers import UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
from .selectors import list_users, get_user_by_id
from .services import (
    register_user,
    update_user_role,
    verify_user_email,
    resend_verification_email,
    request_password_reset,
    reset_password_with_token,
    initiate_login,
    verify_login_otp,
    resend_login_otp,
)

class LoginInitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('username')
        password = request.data.get('password')
        requested_role = request.data.get('requested_role')

        challenge = initiate_login(
            identifier=identifier,
            password=password,
            requested_role=requested_role
        )
        return Response(challenge, status=status.HTTP_200_OK)

class VerifyLoginOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_token = request.data.get('session_token')
        otp = request.data.get('otp') or request.data.get('otp_code')

        tokens_and_user = verify_login_otp(
            session_token=session_token,
            otp_code=otp
        )
        return Response(tokens_and_user, status=status.HTTP_200_OK)

class ResendLoginOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        session_token = request.data.get('session_token')
        result = resend_login_otp(session_token=session_token)
        return Response(result, status=status.HTTP_200_OK)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response_data = {
            'success': True,
            'message': 'Account created successfully! Welcome to GreenGrid.',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token') or request.query_params.get('token')
        if not token:
            return Response(
                {'error': {'message': 'Verification token is required.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = verify_user_email(token)
            return Response({
                'success': True,
                'message': 'Email verified successfully! You may now sign in.',
                'email': user.email
            })
        except Exception as e:
            msg = getattr(e, 'message', str(e))
            if hasattr(e, 'messages'):
                msg = e.messages[0]
            return Response(
                {'error': {'message': msg}},
                status=status.HTTP_400_BAD_REQUEST
            )

class ResendVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': {'message': 'Email address is required.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            msg = resend_verification_email(email)
            response_data = {'success': True, 'message': msg}
            if getattr(settings, 'DEBUG', False):
                User = get_user_model()
                user = User.objects.filter(email__iexact=email.strip().lower()).first()
                if user and user.email_verification_token:
                    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
                    response_data['dev_verify_url'] = f"{frontend_url}/verify-email?token={user.email_verification_token}"
            return Response(response_data)
        except Exception as e:
            msg = getattr(e, 'message', str(e))
            if hasattr(e, 'messages'):
                msg = e.messages[0]
            return Response(
                {'error': {'message': msg}},
                status=status.HTTP_400_BAD_REQUEST
            )

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': {'message': 'Email address is required.'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            msg = request_password_reset(email)
            return Response({'success': True, 'message': msg})
        except Exception as e:
            msg = getattr(e, 'message', str(e))
            if hasattr(e, 'messages'):
                msg = e.messages[0]
            return Response(
                {'error': {'message': msg}},
                status=status.HTTP_400_BAD_REQUEST
            )

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password') or request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        if confirm_password and new_password != confirm_password:
            return Response(
                {'error': {'message': 'Passwords do not match.'}},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not token or not new_password:
            return Response(
                {'error': {'message': 'Token and new password are required.'}},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_password_with_token(token, new_password)
            return Response({
                'success': True,
                'message': 'Password reset successfully! You can now log in with your new password.'
            })
        except Exception as e:
            msg = getattr(e, 'message', str(e))
            if hasattr(e, 'messages'):
                msg = e.messages[0]
            return Response(
                {'error': {'message': msg}},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [ReadOnlyOrManagerAdmin]

    def get_queryset(self):
        user = self.request.user
        if not (user and user.is_authenticated):
            User = get_user_model()
            return User.objects.none()

        User = get_user_model()
        role = self.request.query_params.get('role')

        if user.role == 'admin' or user.is_superuser:
            # Admin sees all users, or filtered by requested role
            return list_users(role=role)
        elif user.role == 'manager':
            # Manager sees ONLY manager accounts ("keval manager ki") or viewer accounts
            # Admin accounts are strictly excluded from manager visibility
            if role == 'viewer':
                return User.objects.filter(role='viewer').order_by('-date_joined')
            # By default or if requested: only show managers
            return User.objects.filter(role='manager').order_by('-date_joined')
        else:
            # Viewer only sees their own user details ("viewer ko viewer ki details show ho")
            return User.objects.filter(id=user.id).order_by('-date_joined')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        new_role = request.data.get('role')

        # Managers cannot edit administrator accounts
        if request.user.role == 'manager' and (instance.role == 'admin' or instance.is_superuser):
            return Response(
                {'error': {'message': 'Managers cannot modify administrator accounts.'}},
                status=status.HTTP_403_FORBIDDEN
            )

        if new_role and new_role != instance.role:
            if not (request.user.role == 'admin' or request.user.is_superuser):
                return Response(
                    {'error': {'message': 'Only administrators can change user roles.'}},
                    status=status.HTTP_403_FORBIDDEN
                )
            instance = update_user_role(instance.id, new_role, acting_user=request.user)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
