// Expense interface
export interface Expense {
    id: string;
    amount: number;
    description: string;
    localDate: string; // Format: "YYYY-MM-DD"
    userId: string;
  }
  
  // Expense request interfaces
  export interface CreateExpenseRequest {
    amount: number;
    description: string;
    localDate: string;
  }
  
  export interface UpdateExpenseRequest {
    amount: number;
    description: string;
    localDate: string;
  }
  
  // Monthly budget summary (for frontend calculation/display)
  export interface MonthlyBudgetSummary {
    month: string; // Format: "YYYY-MM"
    totalExpenses: number;
    expenseCount: number;
    expenses: Expense[];
  }