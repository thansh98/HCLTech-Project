import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Loader } from '../components/common';
import { DashboardLayout, PublicLayout } from '../components/layout';
import { ROUTES } from '../constants';

// Public Pages
import HomePage from '../features/public/HomePage';
import AboutPage from '../features/public/AboutPage';
import ContactPage from '../features/public/ContactPage';

// Auth Pages
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import VerifyEmailPage from '../features/auth/VerifyEmailPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';

// Protected Dashboard Pages
import DashboardPage from '../features/dashboard/DashboardPage';
import FacilitiesPage from '../features/facilities/FacilitiesPage';
import MetersPage from '../features/meters/MetersPage';
import ReadingsPage from '../features/readings/ReadingsPage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import BillingPage from '../features/billing/BillingPage';
import RenewablesPage from '../features/renewables/RenewablesPage';
import AlertsPage from '../features/alerts/AlertsPage';
import NotificationsPage from '../features/notifications/NotificationsPage';
import ReportsPage from '../features/reports/ReportsPage';
import UsersPage from '../features/users/UsersPage';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Authenticating GreenGrid..." />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Auth Pages with PublicLayout (Navbar, Outlet, Footer) */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Protected Feature Routes with DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.FACILITIES} element={<FacilitiesPage />} />
          <Route path={ROUTES.METERS} element={<MetersPage />} />
          <Route path={ROUTES.READINGS} element={<ReadingsPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.BILLING} element={<BillingPage />} />
          <Route path={ROUTES.RENEWABLES} element={<RenewablesPage />} />
          <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

          {/* User management restricted to admin and manager */}
          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
