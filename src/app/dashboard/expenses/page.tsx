import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ExpenseTable } from "@/components/expense-table"
import { ExpenseDialog } from "@/components/expense-dialog"
import { Plus, Search } from "lucide-react"
import type { Expense } from "../../../types"
import { useAuth } from "@/contexts/AuthContext"
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/useExpenses"

export default function ExpensesPage() {
  const auth = useAuth()
  const userId = auth.user?.id || ''
  
  // Fetch expenses
  const { data: expenses = [], isLoading } = useExpenses(userId)
  
  // Mutations
  const createExpense = useCreateExpense(userId)
  const updateExpense = useUpdateExpense(userId)
  const deleteExpense = useDeleteExpense(userId)
  
  // UI state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleSave = (data: Omit<Expense, "id"> & { id?: string }) => {
    if (data.id) {
      // Update existing expense
      updateExpense.mutate({
        expenseId: data.id,
        data: {
          amount: data.amount,
          description: data.description,
          localDate: data.localDate,
        }
      })
    } else {
      // Create new expense
      createExpense.mutate({
        amount: data.amount,
        description: data.description,
        localDate: data.localDate,
      })
    }
    setEditingExpense(null)
    setDialogOpen(false)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (deleteId) {
      deleteExpense.mutate(deleteId)
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Expenses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your expenses
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingExpense(null)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
            className="h-10 bg-card border-border pl-9 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </p>
        <p className="text-sm font-medium text-foreground">
          Total: $
          {filteredExpenses
            .reduce((sum, e) => sum + e.amount, 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        </p>
      </div>

      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ExpenseDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingExpense(null)
        }}
        expense={editingExpense}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              Delete expense?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently remove this
              expense from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}