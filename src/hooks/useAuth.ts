import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import type { RegisterRequest, LoginRequest, User } from '../types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: (userId: string) => [...authKeys.all, 'user', userId] as const,
};

// Auth token management
export const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  removeUser: () => {
    localStorage.removeItem('user');
  },
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (response) => {
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
      queryClient.setQueryData(authKeys.user(response.user.id), response.user);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (response) => {
      tokenManager.setToken(response.token);
      tokenManager.setUser(response.user);
      queryClient.setQueryData(authKeys.user(response.user.id), response.user);
    },
  });
};

// Logout function
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    tokenManager.removeToken();
    tokenManager.removeUser();
    queryClient.clear();
  };
};

// Get current user
export const useCurrentUser = () => {
  const user = tokenManager.getUser();

  return useQuery({
    queryKey: user ? authKeys.user(user.id) : ['auth', 'user', 'null'],
    queryFn: () => (user ? authAPI.getUser(user.id) : null),
    enabled: !!user,
    initialData: user || undefined,
  });
};

// Get user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: authKeys.user(userId),
    queryFn: () => authAPI.getUser(userId),
    enabled: !!userId,
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const user = tokenManager.getUser();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      authAPI.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user(updatedUser.id), updatedUser);
      if (user?.id === updatedUser.id) {
        tokenManager.setUser(updatedUser);
      }
    },
  });
};