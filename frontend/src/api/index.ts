// frontend/src/api/index.ts

import axios from 'axios';
import { apiConfig } from '../config/api.config'; // Adjusted path

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: apiConfig.headers // Apply default headers
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