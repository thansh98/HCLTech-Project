from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.services import (
    register_user,
    update_user_role,
    verify_user_email,
    resend_verification_email,
    request_password_reset,
    reset_password_with_token,
)
from apps.accounts.selectors import list_users, get_user_by_id

User = get_user_model()

class AccountsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='password123',
            role='admin',
            is_email_verified=True
        )
        self.viewer_user = User.objects.create_user(
            username='viewer',
            email='viewer@example.com',
            password='password123',
            role='viewer',
            is_email_verified=True
        )

    def test_register_service(self):
        user = register_user(
            email='newuser@example.com',
            password='securepassword123',
            role='viewer',
            first_name='John',
            last_name='Doe'
        )
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertEqual(user.role, 'viewer')
        self.assertFalse(user.is_email_verified)
        self.assertIsNotNone(user.email_verification_token)

    def test_email_verification_flow(self):
        # Register new unverified user
        user = register_user(
            email='verifytest@example.com',
            password='password123',
            role='viewer'
        )
        # Attempt login before verification -> Should fail
        res = self.client.post('/api/auth/login/', {
            'email': 'verifytest@example.com',
            'password': 'password123'
        })
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Verify via API endpoint
        verify_res = self.client.post('/api/auth/verify-email/', {
            'token': user.email_verification_token
        })
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)

        # Re-attempt login with role -> Should return OTP challenge
        login_res = self.client.post('/api/auth/login/', {
            'email': 'verifytest@example.com',
            'password': 'password123',
            'requested_role': 'viewer'
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data.get('requires_otp'))

    def test_role_validation_and_otp_lifecycle(self):
        # 1. No role selected
        no_role_res = self.client.post('/api/auth/login/', {
            'email': 'viewer@example.com',
            'password': 'password123',
            'requested_role': ''
        })
        self.assertEqual(no_role_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('select your requested role', str(no_role_res.data).lower())

        # 2. Viewer user attempts to log in requesting 'admin' role
        mismatch_res = self.client.post('/api/auth/login/', {
            'email': 'viewer@example.com',
            'password': 'password123',
            'requested_role': 'admin'
        })
        self.assertEqual(mismatch_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('not authorized for this account', str(mismatch_res.data))

        # 3. Correct role & credentials -> Returns OTP challenge
        init_res = self.client.post('/api/auth/login/', {
            'email': 'viewer@example.com',
            'password': 'password123',
            'requested_role': 'viewer'
        })
        self.assertEqual(init_res.status_code, status.HTTP_200_OK)
        self.assertTrue(init_res.data['requires_otp'])
        session_token = init_res.data['session_token']
        self.assertTrue(bool(session_token))
        self.assertIn('vi****@example.com', init_res.data['masked_email'])

        # Retrieve generated OTP from DB
        self.viewer_user.refresh_from_db()
        correct_otp = self.viewer_user.login_otp
        self.assertEqual(len(correct_otp), 6)

        # 4. Wrong OTP -> Rejected
        wrong_res = self.client.post('/api/auth/verify-otp/', {
            'session_token': session_token,
            'otp': '000000'
        })
        self.assertEqual(wrong_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # 5. Immediate resend -> Cooldown error
        cooldown_res = self.client.post('/api/auth/resend-otp/', {
            'session_token': session_token
        })
        self.assertEqual(cooldown_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('cooldown_active', str(cooldown_res.data))

        # 6. Correct OTP -> Issues JWT
        verify_res = self.client.post('/api/auth/verify-otp/', {
            'session_token': session_token,
            'otp': correct_otp
        })
        self.assertEqual(verify_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', verify_res.data)
        self.assertIn('refresh', verify_res.data)
        self.assertEqual(verify_res.data['user']['role'], 'viewer')

    def test_password_reset_flow(self):
        # Request password reset
        forgot_res = self.client.post('/api/auth/forgot-password/', {
            'email': 'viewer@example.com'
        })
        self.assertEqual(forgot_res.status_code, status.HTTP_200_OK)

        self.viewer_user.refresh_from_db()
        token = self.viewer_user.password_reset_token
        self.assertIsNotNone(token)

        # Reset password
        reset_res = self.client.post('/api/auth/reset-password/', {
            'token': token,
            'new_password': 'brandnewpassword123',
            'confirm_password': 'brandnewpassword123'
        })
        self.assertEqual(reset_res.status_code, status.HTTP_200_OK)

        # Log in with new password
        login_res = self.client.post('/api/auth/login/', {
            'email': 'viewer@example.com',
            'password': 'brandnewpassword123',
            'requested_role': 'viewer'
        })
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertTrue(login_res.data['requires_otp'])

    def test_update_role_service(self):
        updated = update_user_role(self.viewer_user.id, 'manager', acting_user=self.admin_user)
        self.assertEqual(updated.role, 'manager')

    def test_selectors(self):
        users = list_users()
        self.assertGreaterEqual(users.count(), 2)
        u = get_user_by_id(self.admin_user.id)
        self.assertIsNotNone(u)

    def test_direct_token_obtain_api(self):
        response = self.client.post('/api/auth/token/direct/', {
            'username': 'admin',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['role'], 'admin')

    def test_current_user_api(self):
        self.client.force_authenticate(user=self.viewer_user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'viewer')
