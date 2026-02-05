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
  const dailyData = expenses.reduce<Record<string, number>>((acc, exp) => {
    const day = new Date(exp.localDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    acc[day] = (acc[day] || 0) + exp.amount
    return acc
  }, {})

  const chartData = Object.entries(dailyData)
    .map(([day, amount]) => ({ day, amount: Number(amount.toFixed(2)) }))
    .reverse()
    .slice(0, 7)
    .reverse()

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
