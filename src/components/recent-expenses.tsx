import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "../types"

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.localDate).getTime() - new Date(a.localDate).getTime())
    .slice(0, 5)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base font-semibold text-foreground">
          Recent Transactions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your latest expenses
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-1">
          {recent.map((expense) => {
            return (
              <div
                key={expense.id}
                className="flex items-center gap-4 rounded-lg p-3 hover:bg-secondary/50 transition-colors"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                >
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {expense.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(expense.localDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  -${expense.amount.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
