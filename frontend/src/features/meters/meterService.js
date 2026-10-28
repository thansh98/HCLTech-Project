import api from '../../services/api';

export const meterService = {
  async getMeters(params = {}) {
    const res = await api.get('/meters/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async createMeter(data) {
    const res = await api.post('/meters/', data);
    return res.data;
  },

  async updateMeter(id, data) {
    const res = await api.patch(`/meters/${id}/`, data);
    return res.data;
  },

  async deleteMeter(id) {
    await api.delete(`/meters/${id}/`);
  },
};
