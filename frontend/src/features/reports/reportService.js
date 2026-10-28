import api from '../../services/api';

export const reportService = {
  async exportReadingsCSV(params = {}) {
    const res = await api.get('/reports/export/readings/', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  async getExecutiveSummary(facilityId = null) {
    const params = facilityId ? { facility: facilityId } : {};
    const res = await api.get('/reports/summary/', { params });
    return res.data;
  },
};
