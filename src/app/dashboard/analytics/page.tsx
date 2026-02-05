import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { MOCK_EXPENSES } from "@/lib/mock-data"
import type { Expense } from "../../../types"

const barConfig = {
  amount: { label: "Spending", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const lineConfig = {
  cumulative: { label: "Cumulative", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const areaConfig = {
  amount: { label: "Daily", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const [expenses] = useState<Expense[]>(MOCK_EXPENSES)

  // Cumulative spending over time
  const sortedByDate = [...expenses].sort(
    (a, b) => new Date(a.localDate).getTime() - new Date(b.localDate).getTime()
  )
  let running = 0
  const cumulativeData = sortedByDate.map((exp) => {
    running += exp.amount
    return {
      date: new Date(exp.localDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      cumulative: Number(running.toFixed(2)),
    }
  })

  // Daily spending trend
  const dailyMap = expenses.reduce<Record<string, number>>((acc, exp) => {
    const day = new Date(exp.localDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    acc[day] = (acc[day] || 0) + exp.amount
    return acc
  }, {})
  const dailyData = Object.entries(dailyMap)
    .map(([day, amount]) => ({ day, amount: Number(amount.toFixed(2)) }))
    .reverse()

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deep dive into your spending patterns
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cumulative Spending */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base font-semibold text-foreground">
              Cumulative Spending
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total spending over time - ${totalSpent.toFixed(2)}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={lineConfig} className="h-[280px] w-full">
              <LineChart
                data={cumulativeData}
                margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(v) => `$${v}`}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="var(--color-cumulative)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-cumulative)" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Spending Trend */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base font-semibold text-foreground">
            Daily Spending Trend
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Day-by-day breakdown of your expenses
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <ChartContainer config={areaConfig} className="h-[280px] w-full">
            <AreaChart
              data={dailyData}
              margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
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
                tickFormatter={(v) => `$${v}`}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--color-amount)"
                strokeWidth={2.5}
                fill="url(#fillAmount)"
                dot={{ r: 3, fill: "var(--color-amount)" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// Need to import Cell for individual bar coloring
import { Cell } from "recharts"
