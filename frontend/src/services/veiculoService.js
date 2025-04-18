import api from './api';

const veiculoService = {
  listar: async () => {
    try {
      const response = await api.get('/veiculos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      throw error;
    }
  },

  criar: async (veiculo) => {
    try {
      const response = await api.post('/veiculos', veiculo);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },

  atualizar: async (id, veiculo) => {
    try {
      const response = await api.put(`/veiculos/${id}`, veiculo);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },

  excluir: async (id) => {
    try {
      await api.delete(`/veiculos/${id}`);
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      throw error;
    }
  },
};

export default veiculoService; 