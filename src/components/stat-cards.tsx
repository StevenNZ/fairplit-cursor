import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Expense } from "../types"

interface StatCardsProps {
  expenses: Expense[]
  previousExpenses?: Expense[] // Add previous period expenses
}

export function StatCards({ expenses, previousExpenses = [] }: StatCardsProps) {
  // Current period calculations
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0
  const transactionCount = expenses.length

  // Previous period calculations
  const prevTotalSpent = previousExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const prevAvgExpense = previousExpenses.length > 0 ? prevTotalSpent / previousExpenses.length : 0
  const prevHighestExpense = previousExpenses.length > 0 ? Math.max(...previousExpenses.map((e) => e.amount)) : 0
  const prevTransactionCount = previousExpenses.length

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, trend: "neutral" as const }
    const change = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(change),
      trend: change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const
    }
  }

  const totalSpentChange = calculateChange(totalSpent, prevTotalSpent)
  const avgExpenseChange = calculateChange(avgExpense, prevAvgExpense)
  const highestExpenseChange = calculateChange(highestExpense, prevHighestExpense)
  const transactionChange = transactionCount - prevTransactionCount

  const stats = [
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: totalSpentChange.percentage > 0 
        ? `${totalSpentChange.trend === "up" ? "+" : "-"}${totalSpentChange.percentage.toFixed(1)}%`
        : "No change",
      trend: totalSpentChange.trend,
      icon: DollarSign,
    },
    {
      label: "Average Expense",
      value: `$${avgExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: avgExpenseChange.percentage > 0
        ? `${avgExpenseChange.trend === "up" ? "+" : "-"}${avgExpenseChange.percentage.toFixed(1)}%`
        : "No change",
      trend: avgExpenseChange.trend,
      icon: TrendingDown,
    },
    {
      label: "Highest Expense",
      value: `$${highestExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: highestExpenseChange.percentage > 0
        ? `${highestExpenseChange.trend === "up" ? "+" : "-"}${highestExpenseChange.percentage.toFixed(1)}%`
        : "No change",
      trend: highestExpenseChange.trend,
      icon: TrendingUp,
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      change: transactionChange !== 0 ? `${transactionChange > 0 ? "+" : ""}${transactionChange}` : "No change",
      trend: transactionChange > 0 ? "up" as const : transactionChange < 0 ? "down" as const : "neutral" as const,
      icon: CreditCard,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <span className="font-display text-2xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
