import api from '../../services/api';

export const alertService = {
  async getAlerts(params = {}) {
    const res = await api.get('/alerts/history/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async acknowledgeAlert(id) {
    const res = await api.post(`/alerts/history/${id}/acknowledge/`);
    return res.data;
  },

  async resolveAlert(id) {
    const res = await api.post(`/alerts/history/${id}/resolve/`);
    return res.data;
  },

  async getThresholds(params = {}) {
    const res = await api.get('/alerts/thresholds/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async createThreshold(data) {
    const res = await api.post('/alerts/thresholds/', data);
    return res.data;
  },
};
