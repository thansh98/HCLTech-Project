import api from '../../services/api';

export const userService = {
  async getUsers(params = {}) {
    const res = await api.get('/users/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async updateUserRole(id, role) {
    const res = await api.patch(`/users/${id}/`, { role });
    return res.data;
  },
};
