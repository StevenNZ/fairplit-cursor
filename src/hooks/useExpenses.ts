import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseAPI } from '../api/expenseAPI';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types';

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (userId: string) => [...expenseKeys.lists(), userId] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (userId: string, expenseId: string) => 
    [...expenseKeys.details(), userId, expenseId] as const,
};

// Get all expenses for a user
export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: expenseKeys.list(userId),
    queryFn: () => expenseAPI.getExpenses(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
  });
};

// Create expense mutation
export const useCreateExpense = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) =>
      expenseAPI.createExpense(userId, data),
    onSuccess: () => {
      // Invalidate and refetch expenses list
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.list(userId) 
      });
    },
  });
};

// Update expense mutation
export const useUpdateExpense = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      expenseId, 
      data 
    }: { 
      expenseId: string; 
      data: UpdateExpenseRequest 
    }) => expenseAPI.updateExpense(userId, expenseId, data),
    onSuccess: (updatedExpense) => {
      // Update cache for the specific expense
      queryClient.setQueryData(
        expenseKeys.detail(userId, updatedExpense.id),
        updatedExpense
      );
      // Invalidate list to refetch (ensures list is updated)
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.list(userId) 
      });
    },
  });
};

// Delete expense mutation
export const useDeleteExpense = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) =>
      expenseAPI.deleteExpense(userId, expenseId),
    onSuccess: (_, expenseId) => {
      // Remove from cache
      queryClient.removeQueries({ 
        queryKey: expenseKeys.detail(userId, expenseId) 
      });
      // Invalidate list to refetch
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.list(userId) 
      });
    },
  });
};