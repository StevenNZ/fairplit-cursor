import { useState } from "react"
import { StatCards } from "@/components/stat-cards"
import { SpendingChart } from "@/components/spending-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseDialog } from "@/components/expense-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MOCK_EXPENSES } from "@/lib/mock-data"
import type { Expense } from "../../types"

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSave = (data: Omit<Expense, "id"> & { id?: string }) => {
    if (data.id) {
      setExpenses((prev) =>
        prev.map((e) => (e.id === data.id ? { ...e, ...data } as Expense : e))
      )
    } else {
      setExpenses((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID() } as Expense,
      ])
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your financial activity
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <StatCards expenses={expenses} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart expenses={expenses} />
      </div>

      <RecentExpenses expenses={expenses} />

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
