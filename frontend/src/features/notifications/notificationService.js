import api from '../../services/api';

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/notifications/', { params });
    // Support paginated or direct array responses
    return response.data?.results !== undefined ? response.data.results : response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count/');
    return response.data?.unread_count ?? 0;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read/`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/mark-all-read/');
    return response.data;
  },
};
