import { z } from 'zod'
import { todos } from './create-todo'

export default defineAction({
  input: z.object({
    id: z.number(),
  }),
  handler: async ({ input }) => {
    const index = todos.findIndex(t => t.id === input.id)
    if (index === -1) {
      throw createActionError({
        code: 'NOT_FOUND',
        message: `Todo #${input.id} not found`,
        statusCode: 404,
      })
    }

    const [removed] = todos.splice(index, 1)
    return { deleted: removed }
  },
})
