import { createContext, useContext } from 'react';
import { useCurrentUser, useLogout, tokenManager } from '../hooks/useAuth';
import type { User } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/api/authAPI';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const logout = useLogout();

  // fetch current user from backend if token exists
  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authAPI.getCurrentUser,
    enabled: !!tokenManager.getToken(),
    retry: false,
    initialData: tokenManager.getUser() || undefined, // hydrate from localStorage
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
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