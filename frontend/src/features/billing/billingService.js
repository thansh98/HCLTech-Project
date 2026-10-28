import api from '../../services/api';

export const billingService = {
  async getBills(params = {}) {
    const res = await api.get('/billing/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async createBill(data) {
    const res = await api.post('/billing/', data);
    return res.data;
  },

  async updateBill(id, data) {
    const res = await api.patch(`/billing/${id}/`, data);
    return res.data;
  },

  async deleteBill(id) {
    await api.delete(`/billing/${id}/`);
  },
};
