import api from '../../services/api';

export const renewableService = {
  async getRecords(params = {}) {
    const res = await api.get('/renewables/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async getBreakdown(facilityId = null) {
    const params = facilityId ? { facility: facilityId } : {};
    const res = await api.get('/renewables/breakdown/', { params });
    return res.data;
  },

  async recordGeneration(data) {
    const res = await api.post('/renewables/', data);
    return res.data;
  },

  async deleteRecord(id) {
    await api.delete(`/renewables/${id}/`);
  },
};
