import api from './api';

const relatorioService = {
  gerar: async (tipo, dataInicio, dataFim, filtro) => {
    try {
      const response = await api.post('/relatorios', {
        tipo,
        dataInicio,
        dataFim,
        filtro,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  },

  listarTipos: async () => {
    try {
      const response = await api.get('/relatorios/tipos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar tipos de relatório:', error);
      throw error;
    }
  },
};

export default relatorioService; 