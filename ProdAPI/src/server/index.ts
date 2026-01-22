import { router } from "../server/trpc.js"
import { todoRouter } from "../../routes/todo/todo.routes.js";

const appRouter = router({
    todos: todoRouter
})

export type AppRouter = typeof appRouter;