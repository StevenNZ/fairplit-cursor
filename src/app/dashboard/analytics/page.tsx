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
import type { Expense } from "../../../types"
import { useAuth } from "@/contexts/AuthContext"
import { useExpenses } from "@/hooks/useExpenses"

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
  const auth = useAuth()
  const { data: expenses = [], isLoading } = useExpenses(auth.user?.id || '')

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Sort expenses by date (oldest to newest)
  const sortedByDate = [...expenses].sort(
    (a, b) => new Date(a.localDate).getTime() - new Date(b.localDate).getTime()
  )

  // Cumulative spending over time
  let running = 0
  const cumulativeData = sortedByDate.map((exp) => {
    running += exp.amount
    const date = new Date(exp.localDate)
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      cumulative: Number(running.toFixed(2)),
      fullDate: date.toISOString().slice(0, 10), // For sorting
    }
  })

  // Daily spending trend - group by actual date
  const dailyMap = sortedByDate.reduce<Record<string, number>>((acc, exp) => {
    const dateKey = new Date(exp.localDate).toISOString().slice(0, 10)
    acc[dateKey] = (acc[dateKey] || 0) + exp.amount
    return acc
  }, {})

  // Convert to array and sort by date (oldest to newest)
  const dailyData = Object.entries(dailyMap)
    .map(([dateKey, amount]) => ({
      day: new Date(dateKey).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      amount: Number(amount.toFixed(2)),
      dateKey, // Keep for sorting
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const avgDaily = dailyData.length > 0 
    ? totalSpent / dailyData.length 
    : 0

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
              Total spending over time - ${totalSpent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={lineConfig} className="h-[280px] w-full">
              <LineChart
                data={cumulativeData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
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
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
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

        {/* Average Daily Spending */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base font-semibold text-foreground">
              Daily Average
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Average spending per day - ${avgDaily.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={barConfig} className="h-[280px] w-full">
              <BarChart
                data={dailyData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
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
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
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
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
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
                tickFormatter={(v) => `$${v.toLocaleString()}`}
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