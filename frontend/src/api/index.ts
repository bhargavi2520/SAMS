// frontend/src/api/index.ts

import axios from 'axios';

// Get the backend URL from environment variables
const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// You can also add interceptors here for handling tokens automatically
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // Or wherever you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;