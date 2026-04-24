import axios from 'axios';

// Azure LoadBalancer IP
const BASE_URL = 'http://20.207.96.72/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear tokens and redirect to login)
      console.warn('Unauthorized request');
    }
    return Promise.reject(error);
  }
);
