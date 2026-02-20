import { z } from 'zod'

// In-memory store (shared across actions via module scope)
export const todos = [
  { id: 1, title: 'Learn Nuxt', done: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 2, title: 'Try nuxt-actions', done: false, createdAt: '2025-01-02T00:00:00Z' },
  { id: 3, title: 'Build something amazing', done: false, createdAt: '2025-01-03T00:00:00Z' },
]

export default defineAction({
  input: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  }),
  handler: async ({ input }) => {
    const todo = {
      id: Date.now(),
      title: input.title,
      done: false,
      createdAt: new Date().toISOString(),
    }
    todos.push(todo)
    return todo
  },
})
