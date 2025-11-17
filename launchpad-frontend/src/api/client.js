import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🌐 API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('📤 Request to:', config.url);
  console.log('📤 Token being sent:', token ? token.substring(0, 20) + '...' : 'NONE');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response from:', response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Request failed:', error.config?.url);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Error:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🚫 401 Unauthorized - clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
