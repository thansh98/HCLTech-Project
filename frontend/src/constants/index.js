export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  FACILITIES: '/facilities',
  METERS: '/meters',
  READINGS: '/readings',
  ANALYTICS: '/analytics',
  BILLING: '/billing',
  RENEWABLES: '/renewables',
  ALERTS: '/alerts',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  USERS: '/users',
};

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
};

export const FACILITY_CATEGORIES = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'residential', label: 'Residential' },
  { value: 'campus', label: 'Campus' },
];

export const ENERGY_TYPES = [
  { value: 'electricity', label: 'Electricity', unit: 'kWh' },
  { value: 'water', label: 'Water', unit: 'Liters' },
  { value: 'gas', label: 'Natural Gas', unit: 'Therms' },
  { value: 'solar', label: 'Solar Generation', unit: 'kWh' },
];

export const RENEWABLE_SOURCES = [
  { value: 'solar', label: 'Solar Panels' },
  { value: 'wind', label: 'Wind Turbine' },
  { value: 'geothermal', label: 'Geothermal' },
  { value: 'biomass', label: 'Biomass' },
];

export const ALERT_SEVERITIES = [
  { value: 'info', label: 'Information' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
];
