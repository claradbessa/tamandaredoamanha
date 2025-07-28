import axios from 'axios';

const api = axios.create({
  baseURL: 'https://render-m7dj.onrender.com',
  headers: {
    'Accept': 'application/json',
  }
});

export default api;