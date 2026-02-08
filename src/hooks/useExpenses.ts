import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseAPI } from '../api/expenseAPI';
import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types';

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
}

// Get all expenses for a user
export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: expenseKeys.all,
    queryFn: () => expenseAPI.getExpenses(userId),
  });
};

// Create expense mutation
export const useCreateExpense = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) =>
      expenseAPI.createExpense(userId, data),
    onSuccess: (newExpense) => {
      // Invalidate and refetch expenses list
      queryClient.setQueryData(expenseKeys.all, (old: any[] = []) => [
        ...old,
        newExpense,
      ]);
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
      queryClient.setQueryData(expenseKeys.all, (old: any[] = []) =>
        old.map(e => e.id === updatedExpense.id ? updatedExpense : e)
      );
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
      queryClient.setQueryData(expenseKeys.all, (old: any[] = []) =>
        old.filter((e) => e.id !== expenseId)
      );
    },
  });
};