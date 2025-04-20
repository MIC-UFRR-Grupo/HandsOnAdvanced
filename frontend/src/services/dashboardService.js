import api from './api';

const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },

  getDriverLocation: async () => {
    try {
      const response = await api.get('/dashboard/driver-location');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar localização do motorista:', error);
      throw error;
    }
  }
};

export default dashboardService; 