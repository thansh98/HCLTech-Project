import api from '../../services/api';

export const analyticsService = {
  async getSummary(facilityId = null) {
    const params = facilityId ? { facility: facilityId } : {};
    const res = await api.get('/analytics/summary/', { params });
    return res.data;
  },

  async getTrends(days = 14, facilityId = null) {
    const params = { days };
    if (facilityId) params.facility = facilityId;
    const res = await api.get('/analytics/trends/', { params });
    return res.data;
  },

  async getCosts(facilityId = null) {
    const params = facilityId ? { facility: facilityId } : {};
    const res = await api.get('/analytics/costs/', { params });
    return res.data;
  },
};
