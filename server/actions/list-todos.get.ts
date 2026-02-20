import { todos } from './create-todo'

export default defineAction({
  handler: async () => {
    return { items: todos, total: todos.length }
  },
})
