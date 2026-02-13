import { createContext, useContext, useEffect } from 'react';
import { useCurrentUser, useLogout, tokenManager } from '../hooks/useAuth';
import type { User } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/api/authAPI';
import { useNavigate } from '@tanstack/react-router';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const logout = useLogout()

  useEffect(() => {
    const token = tokenManager.getToken();
    if (token && tokenManager.isTokenExpired(token)) {
      // Token is expired, clear it and logout
      logout();
    }
  }, []);

  // fetch current user from backend if token exists and is valid
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.getCurrentUser,
    enabled: !!tokenManager.getToken() && !tokenManager.isTokenExpired(tokenManager.getToken() || ''),
    retry: false,
    initialData: tokenManager.getUser() || undefined,
  });

  const token = tokenManager.getToken();
  const isAuthenticated = !!user && !!token && !tokenManager.isTokenExpired(token);


  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};