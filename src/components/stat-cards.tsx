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
}

export function StatCards({ expenses }: StatCardsProps) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0
  const transactionCount = expenses.length

  const stats = [
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      label: "Average Expense",
      value: `$${avgExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "-3.2%",
      trend: "down" as const,
      icon: TrendingDown,
    },
    {
      label: "Highest Expense",
      value: `$${highestExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+8.1%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      label: "Transactions",
      value: transactionCount.toString(),
      change: "+5",
      trend: "up" as const,
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
