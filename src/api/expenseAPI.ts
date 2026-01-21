import { apiClient } from './client';
import type { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest 
} from '../types';

// Expense API functions
export const expenseAPI = {
  // Get all expenses for a user
  getExpenses: async (userId: string): Promise<Expense[]> => {
    const response = await apiClient.get<Expense[]>(`/users/${userId}/expenses`);
    return response.data;
  },

  // Create a new expense
  createExpense: async (
    userId: string, 
    data: CreateExpenseRequest
  ): Promise<Expense> => {
    const response = await apiClient.post<Expense>(
      `/users/${userId}/expenses`, 
      data
    );
    return response.data;
  },

  // Update an existing expense
  updateExpense: async (
    userId: string,
    expenseId: string,
    data: UpdateExpenseRequest
  ): Promise<Expense> => {
    const response = await apiClient.put<Expense>(
      `/users/${userId}/expenses/${expenseId}`,
      data
    );
    return response.data;
  },

  // Delete an expense
  deleteExpense: async (
    userId: string,
    expenseId: string
  ): Promise<void> => {
    await apiClient.delete(`/users/${userId}/expenses/${expenseId}`);
  },
};