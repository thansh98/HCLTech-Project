from rest_framework import serializers, exceptions
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_email_verified']

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['viewer', 'manager', 'admin'], default='viewer')
    username = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        confirm = attrs.get('confirm_password')
        if confirm and attrs.get('password') != confirm:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        email = attrs.get('email', '').strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'An account with this email address already exists.'})

        return attrs

    def create(self, validated_data):
        from .services import register_user
        full_name = validated_data.get('full_name', '').strip()
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        if full_name and not (first_name or last_name):
            parts = full_name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

        return register_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            role=validated_data.get('role', 'viewer'),
            username=validated_data.get('username') or None
        )

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    requested_role = serializers.CharField(required=False, allow_blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Allow email as an alternative input field to username
        self.fields['email'] = serializers.EmailField(required=False)
        self.fields[self.username_field].required = False

    def validate(self, attrs):
        identifier = attrs.get('email') or attrs.get(self.username_field)
        password = attrs.get('password')
        requested_role = attrs.get('requested_role')

        if not identifier or not password:
            raise exceptions.AuthenticationFailed('Must include both email/username and password.')

        # Resolve user by email or username
        user = None
        if '@' in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
        if not user:
            user = User.objects.filter(username__iexact=identifier).first()

        if not user or not user.check_password(password):
            raise exceptions.AuthenticationFailed('No active account found with the given credentials.')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('This account has been deactivated.')

        # Ensure account is marked verified
        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=['is_email_verified'])

        # Role validation against privilege escalation
        role_hierarchy = {'viewer': 1, 'manager': 2, 'admin': 3}
        if requested_role:
            user_level = role_hierarchy.get(user.role, 1)
            req_level = role_hierarchy.get(requested_role, 1)
            if req_level > user_level:
                raise exceptions.AuthenticationFailed(
                    detail={
                        'message': f'Access denied: You do not possess the requested {requested_role.title()} privileges.',
                        'code': 'role_mismatch',
                        'actual_role': user.role,
                    },
                    code='role_mismatch'
                )

        attrs[self.username_field] = user.username
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_email_verified': self.user.is_email_verified,
        }
        return data
