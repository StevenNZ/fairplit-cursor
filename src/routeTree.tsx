import {
    createRootRouteWithContext,
    createRoute,
    Outlet,
    redirect,
  } from "@tanstack/react-router"

  import type { AuthContextType } from "./contexts/AuthContext"
  
  // Layouts
  import AuthLayout from "./app/(auth)/layout"
  import DashboardLayout from "./app/dashboard/layout"
  
  // Pages
  import LoginPage from "./app/(auth)/login/page"
  import RegisterPage from "./app/(auth)/register/page"
  import DashboardPage from "./app/dashboard/page"
  import ExpensesPage from "./app/dashboard/expenses/page"
  import AnalyticsPage from "./app/dashboard/analytics/page"
  import SettingsPage from "./app/dashboard/settings/page"
  
  export type RouterContext = {
    auth: AuthContextType
  }
  
  // Root layout - just renders children with base HTML structure
  const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: () => (
      <div className="font-sans antialiased">
        <Outlet />
      </div>
    ),
  })
  
  // Index route - redirects to /login
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LoginPage,
  })
  
  // Auth layout route (wraps login and register)
  const authLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "auth",
    beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
        throw redirect({ to: "/dashboard" })        
      }
    },
    component: () => (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
  })
  
  const loginRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: "/login",
    component: LoginPage,
  })
  
  const registerRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: "/register",
    component: RegisterPage,
  })
  
  // Dashboard layout route (wraps all dashboard pages)
  const dashboardLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    beforeLoad: ({ context }) => {
      if (!context.auth.isAuthenticated) {
        throw redirect({ to: "/login" })
      }
    },
    component: () => (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
  })
  
  const dashboardIndexRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: "/",
    component: DashboardPage,
  })
  
  const expensesRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: "/expenses",
    component: ExpensesPage,
  })
  
  const analyticsRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: "/analytics",
    component: AnalyticsPage,
  })
  
  const settingsRoute = createRoute({
    getParentRoute: () => dashboardLayoutRoute,
    path: "/settings",
    component: SettingsPage,
  })
  
  // Build route tree
  export const routeTree = rootRoute.addChildren([
    indexRoute,
    authLayoutRoute.addChildren([loginRoute, registerRoute]),
    dashboardLayoutRoute.addChildren([
      dashboardIndexRoute,
      expensesRoute,
      analyticsRoute,
      settingsRoute,
    ]),
  ])
  