import axios from 'axios';

const api = axios.create({
  baseURL: 'http://backend.test/api/v1',
  headers: {
    'Accept': 'application/json',
  }
});

export default api;