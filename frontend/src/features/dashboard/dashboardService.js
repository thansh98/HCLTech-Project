import api from '../../services/api';

export const dashboardService = {
  async getSummary(facilityId = null) {
    const params = facilityId ? { facility: facilityId } : {};
    const res = await api.get('/analytics/summary/', { params });
    return res.data;
  },

  async getTrends(days = 7, facilityId = null) {
    const params = { days };
    if (facilityId) params.facility = facilityId;
    const res = await api.get('/analytics/trends/', { params });
    return res.data;
  },
};
