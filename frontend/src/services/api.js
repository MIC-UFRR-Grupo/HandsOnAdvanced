import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // ou a porta que seu backend está rodando
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 