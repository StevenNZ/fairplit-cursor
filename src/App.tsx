import { RouterProvider } from "@tanstack/react-router"
import { useAuth } from "./contexts/AuthContext"
import { createAppRouter } from "./router"

export default function App() {
  const auth = useAuth()

  const router = createAppRouter({
    auth,
  })

  return <RouterProvider router={router} />
}
