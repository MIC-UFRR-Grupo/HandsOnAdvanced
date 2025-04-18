import api from './api';

const driverService = {
  listar: async () => {
    try {
      const response = await api.get('/drivers');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar drivers:', error);
      throw error;
    }
  },

};

export default driverService; 