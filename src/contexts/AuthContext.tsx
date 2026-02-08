import { createContext, useContext } from 'react';
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

  // fetch current user from backend if token exists
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.getCurrentUser,
    enabled: !!tokenManager.getToken(),
    retry: false,
    initialData: tokenManager.getUser() || undefined, // hydrate from localStorage
  });

  const token = tokenManager.getToken();
  const isAuthenticated = !!user && !!token && !isTokenExpired(token);


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

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // exp is in seconds
  } catch {
    return true; // invalid token
  }
}