import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  isVerified?: boolean;
  banned?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.status === 429) {
            // Rate limit - no hacer nada, solo esperar
            console.warn('⚠️ Rate limit alcanzado, esperando...');
            setIsLoading(false);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUser(data.data);
            }
          } else if (response.status === 401 || response.status === 403) {
            // Token inválido o expirado, limpiar
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error: any) {
          // Si es un error de JSON parsing (como con 429), ignorarlo
          if (error.message && error.message.includes('JSON')) {
            console.warn('⚠️ Error de parsing, posible rate limit');
          } else {
            console.error('❌ Error fetching user profile:', error);
          }
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    console.log('✅ Login response:', response);

    // Backend devuelve: { success: true, data: { user, accessToken, refreshToken } }
    const { accessToken, user } = response.data;

    console.log('🔑 Access token:', accessToken);
    console.log('👤 User:', user);

    setToken(accessToken);
    setUser(user);
    localStorage.setItem('token', accessToken);
  };

  const register = async (data: any) => {
    await authService.register(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
