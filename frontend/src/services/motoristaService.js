import api from './api';

const motoristaService = {
  listar: async () => {
    try {
      const response = await api.get('/motoristas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar motoristas:', error);
      throw error;
    }
  },

  criar: async (motorista) => {
    try {
      const response = await api.post('/motoristas', motorista);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar motorista:', error);
      throw error;
    }
  },

  atualizar: async (id, motorista) => {
    try {
      const response = await api.put(`/motoristas/${id}`, motorista);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar motorista:', error);
      throw error;
    }
  },

  excluir: async (id) => {
    try {
      await api.delete(`/motoristas/${id}`);
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      throw error;
    }
  },
};

export default motoristaService; 