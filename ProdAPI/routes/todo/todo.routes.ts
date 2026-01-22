import {router, publicProcedure} from "../../src/server/trpc.js"
import {z} from 'zod'
import { getAllTodosOutputModel, Todo } from "../todo/models.js"

const TODOS: Todo[] = [{id: '1', isCompleted: false, title: "Demo", description: "Demo desc"}]

export const todoRouter = router({
    getAllTodos: publicProcedure
    .input(z.undefined())
    .output(getAllTodosOutputModel)
    .query(()=>{
        return {
            todos: TODOS
        }
    })
})