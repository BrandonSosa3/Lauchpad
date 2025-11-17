import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthProvider mounting...');
    const token = localStorage.getItem('token');
    console.log('🔍 Token on mount:', token ? token.substring(0, 20) : 'none');
    
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('🔍 User data loaded:', parsed);
        setUser(parsed);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Login attempt:', email);
    const response = await authApi.login(email, password);
    console.log('✅ Login response:', response);
    
    // Store token and user data
    console.log('💾 Storing token:', response.access_token.substring(0, 20));
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('✅ Token stored, setting user state');
    setUser(response.user);
    
    // Verify it was stored
    console.log('🔍 Verify token in localStorage:', localStorage.getItem('token')?.substring(0, 20));
  };

  const signup = async (email, password, name) => {
    console.log('📝 Signup attempt:', email);
    const response = await authApi.signup(email, password, name);
    console.log('✅ Signup response:', response);
    
    // Store token and user data
    console.log('💾 Storing token:', response.access_token.substring(0, 20));
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    console.log('✅ Token stored, setting user state');
    setUser(response.user);
    
    // Verify it was stored
    console.log('🔍 Verify token in localStorage:', localStorage.getItem('token')?.substring(0, 20));
  };

  const logout = () => {
    console.log('👋 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    authApi.logout();
  };

  console.log('🔍 Current user state:', user);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
