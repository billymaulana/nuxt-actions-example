import { z } from 'zod'
import { todos } from './create-todo'

export default defineAction({
  input: z.object({
    id: z.number(),
    done: z.boolean(),
  }),
  handler: async ({ input }) => {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 500))

    const todo = todos.find(t => t.id === input.id)
    if (!todo) {
      throw createActionError({
        code: 'NOT_FOUND',
        message: `Todo #${input.id} not found`,
        statusCode: 404,
      })
    }

    todo.done = input.done
    return { id: todo.id, done: todo.done, updatedAt: new Date().toISOString() }
  },
})
