import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Expense } from "../types"

interface ExpenseTableProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const sorted = [...expenses].sort(
    (a, b) => new Date(b.localDate).getTime() - new Date(a.localDate).getTime()
  )

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">
              Title
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Category
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Date
            </TableHead>
            <TableHead className="text-right text-muted-foreground font-medium">
              Amount
            </TableHead>
            <TableHead className="text-right text-muted-foreground font-medium w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((expense) => {
            return (
              <TableRow
                key={expense.id}
                className="border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {expense.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(expense.localDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground tabular-nums">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        aria-label={`Actions for ${expense.description}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem
                        onClick={() => onEdit(expense)}
                        className="text-foreground focus:bg-secondary"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(expense.id)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No expenses found. Add your first expense to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
