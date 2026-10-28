import api from '../../services/api';

export const facilityService = {
  async getFacilities(params = {}) {
    const res = await api.get('/facilities/', { params });
    // DRF may return array or paginated results object
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async getFacility(id) {
    const res = await api.get(`/facilities/${id}/`);
    return res.data;
  },

  async createFacility(data) {
    const res = await api.post('/facilities/', data);
    return res.data;
  },

  async updateFacility(id, data) {
    const res = await api.patch(`/facilities/${id}/`, data);
    return res.data;
  },

  async deleteFacility(id) {
    await api.delete(`/facilities/${id}/`);
  },
};
