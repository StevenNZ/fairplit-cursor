import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree"
import type { AuthContextType } from "./contexts/AuthContext"

export type RouterContext = {
  auth: AuthContextType
}

// router factory
export const createAppRouter = (context: RouterContext) =>
  createRouter({
    routeTree,
    context,
  })

// router type for global typing
export type AppRouter = ReturnType<typeof createAppRouter>

// register router globally (CRITICAL)
declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter
  }
}
