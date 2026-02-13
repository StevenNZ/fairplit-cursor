import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '../hooks/useAuth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken(); // Use tokenManager instead
    
        // Check if token is expired before making the request
        if (token && tokenManager.isTokenExpired(token)) {
          console.log('⏰ Token expired, clearing and redirecting...');
          tokenManager.removeToken();
          tokenManager.removeUser();
          window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);