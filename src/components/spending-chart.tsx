import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import type { Expense } from "../types"

interface SpendingChartProps {
  expenses: Expense[]
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SpendingChart({ expenses }: SpendingChartProps) {
  // Get the last 7 days
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset to start of day
  
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    last7Days.push(date)
  }

  // Filter expenses to only last 7 days and group by date
  const dailyData = expenses.reduce<Record<string, number>>((acc, exp) => {
    const expenseDate = new Date(exp.localDate)
    expenseDate.setHours(0, 0, 0, 0) // Reset to start of day for comparison
    
    // Only include expenses from the last 7 days
    const daysDiff = Math.floor((today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff >= 0 && daysDiff < 7) {
      const dateKey = expenseDate.toISOString().split('T')[0] // Use YYYY-MM-DD format
      acc[dateKey] = (acc[dateKey] || 0) + exp.amount
    }
    
    return acc
  }, {})

  // Create chart data with all 7 days (including days with $0)
  const chartData = last7Days.map(date => {
    const dateKey = date.toISOString().split('T')[0]
    const formattedDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    
    return {
      day: formattedDay,
      amount: Number((dailyData[dateKey] || 0).toFixed(2)),
      date: dateKey // Keep for reference
    }
  })

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base font-semibold text-foreground">
          Daily Spending
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your spending over the last 7 days
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={chartData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
            />
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}