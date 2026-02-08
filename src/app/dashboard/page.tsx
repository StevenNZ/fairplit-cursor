import { useEffect, useState } from "react"
import { StatCards } from "@/components/stat-cards"
import { SpendingChart } from "@/components/spending-chart"
import { RecentExpenses } from "@/components/recent-expenses"
import { ExpenseDialog } from "@/components/expense-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Expense } from "../../types"
import { useCreateExpense, useExpenses } from "@/hooks/useExpenses"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const {user, isLoading: userLoading} = useAuth()

  if (!user) {
    return <div>Not logged in</div>
  }

  if (userLoading) {
    return <div>Loading user...</div>
  }

  const { data: expenses = [], isLoading } = useExpenses(user.id)
  const createExpense = useCreateExpense(user.id)

  if (isLoading) {
    return <div>Loading expenses...</div>
  }

  const handleSave = (data: Omit<Expense, "id"> & { id?: string }) => {
    if (!data.id) {
      createExpense.mutate(data)
      setDialogOpen(false)
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
