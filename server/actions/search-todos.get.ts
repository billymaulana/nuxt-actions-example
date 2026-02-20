import { z } from 'zod'
import { todos } from './create-todo'

export default defineAction({
  input: z.object({
    q: z.string().optional().default(''),
  }),
  handler: async ({ input }) => {
    // Simulate a small delay for SSR demo
    await new Promise(r => setTimeout(r, 100))

    const q = input.q.toLowerCase()
    const items = q
      ? todos.filter(t => t.title.toLowerCase().includes(q))
      : todos

    return { items, total: items.length, query: input.q }
  },
})
