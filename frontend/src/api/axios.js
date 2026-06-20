import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Apunta al puerto de tu backend
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
