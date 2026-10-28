import api from './api';
import { storageService } from './storageService';

export const authService = {
  async loginInit(credentials) {
    const payload = typeof credentials === 'string'
      ? { username: credentials, password: arguments[1] }
      : credentials;

    const response = await api.post('/auth/login/', payload);
    const { access, refresh, user } = response.data;
    if (access) {
      storageService.setAccessToken(access);
      storageService.setRefreshToken(refresh);
      if (user) {
        storageService.setUser(user);
      }
    }
    return response.data;
  },

  async verifyOTP({ session_token, otp }) {
    // Kept for backward compatibility
    const response = await api.post('/auth/verify-otp/', {
      session_token,
      otp,
    });
    const { access, refresh, user } = response.data;
    if (access) {
      storageService.setAccessToken(access);
      storageService.setRefreshToken(refresh);
    }
    if (user) {
      storageService.setUser(user);
    } else {
      const userRes = await api.get('/auth/me/');
      storageService.setUser(userRes.data);
    }
    return storageService.getUser();
  },

  async resendOTP({ session_token }) {
    const response = await api.post('/auth/resend-otp/', { session_token });
    return response.data;
  },

  async login(credentials) {
    const payload = typeof credentials === 'string'
      ? { username: credentials, password: arguments[1] }
      : credentials;

    // Call direct login
    const response = await api.post('/auth/login/', payload);
    const { access, refresh, user } = response.data;
    if (access) {
      storageService.setAccessToken(access);
      storageService.setRefreshToken(refresh);
    }
    if (user) {
      storageService.setUser(user);
    } else {
      const userRes = await api.get('/auth/me/');
      storageService.setUser(userRes.data);
    }
    return storageService.getUser();
  },

  async register(data) {
    const response = await api.post('/auth/register/', data);
    const { access, refresh, user } = response.data;
    if (access) {
      storageService.setAccessToken(access);
      storageService.setRefreshToken(refresh);
    }
    if (user) {
      storageService.setUser(user);
    }
    return response.data;
  },

  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email/', { token });
    return response.data;
  },

  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification/', { email });
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password/', { email });
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/auth/reset-password/', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me/');
    storageService.setUser(response.data);
    return response.data;
  },

  logout() {
    storageService.clearAuth();
  },
};
