import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree"
import type { RouterContext } from "./routerTypes"

export const createAppRouter = (context: RouterContext) =>
  createRouter({
    routeTree,
    context,
  })
