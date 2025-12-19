import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
      console.log('🔍 AuthContext useEffect - token:', token ? 'exists' : 'null');
      console.log('🧪 Token preview:', token?.substring(0, 50) + '...');

      if (token) {
        try {
          // Fetch user profile from backend
          console.log('📡 Fetching user profile...');
          const response = await fetch('http://localhost:3000/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('📥 Response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.warn('⚠️ Server error:', errorData);
          }

          if (response.ok) {
            const data = await response.json();
            console.log('✅ User profile loaded:', data);
            setUser(data.data);
          } else {
            // Token inválido, limpiar
            console.warn('⚠️ Token inválido o endpoint no encontrado. Status:', response.status);
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
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
