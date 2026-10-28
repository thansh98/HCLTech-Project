import api from '../../services/api';

export const readingService = {
  async getReadings(params = {}) {
    const res = await api.get('/energy/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async addReading(data) {
    const res = await api.post('/energy/', data);
    return res.data;
  },

  async uploadCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/energy/import-csv/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
