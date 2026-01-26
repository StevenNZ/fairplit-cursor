import type { MonthlyBudgetSummary } from '../types';

interface MonthlyBudgetSummaryCardProps {
  summary: MonthlyBudgetSummary;
}

export const MonthlyBudgetSummaryCard = ({ summary }: MonthlyBudgetSummaryCardProps) => {
  // Format month from "YYYY-MM" to "Month YYYY"
  const formatMonth = (monthString: string): string => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Assuming amounts are in cents
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {formatMonth(summary.month)}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Monthly Budget Summary</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Number of Transactions</p>
          <p className="text-3xl font-bold text-gray-900">
            {summary.expenseCount}
          </p>
        </div>
      </div>

      {/* Expenses List */}
      {summary.expenses.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Expenses
          </h3>
          <div className="space-y-2">
            {summary.expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {expense.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(expense.localDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 ml-4">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            ))}
            {summary.expenses.length > 5 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                +{summary.expenses.length - 5} more expenses
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No expenses for this month</p>
        </div>
      )}
    </div>
  );
};