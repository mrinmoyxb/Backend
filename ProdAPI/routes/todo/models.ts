import {z} from 'zod'

export const todoModel = z.object({
    id: z.string().describe("UUID of the todo"),
    title: z.string().describe("Title of the todo"),
    description: z.string().optional().nullable().describe("description of the task"),
    isCompleted: z.boolean().optional().default(false).describe("if the todo is completed set to true")
})

export type Todo = z.infer<typeof todoModel>
export const getAllTodosOutputModel = z.object({
    todos: z.array(todoModel)
})