import { apiClient } from './client';

export const authApi = {
  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return data;
  },

  signup: async (email, password, name) => {
    const { data } = await apiClient.post('/auth/register', {
      email,
      password,
      name,
    });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
