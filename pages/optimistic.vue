<script setup lang="ts">
import { toggleTodo } from '#actions'

const todos = ref([
  { id: 1, title: 'Learn Nuxt', done: true },
  { id: 2, title: 'Try nuxt-actions', done: false },
  { id: 3, title: 'Build something amazing', done: false },
  { id: 4, title: 'Deploy to production', done: false },
])

const optimisticAction = useOptimisticAction(toggleTodo, {
  currentData: todos,
  updateFn(input: { id: number, done: boolean }, current: typeof todos.value) {
    return current.map(t =>
      t.id === input.id ? { ...t, done: input.done } : t,
    )
  },
  onSuccess(data) {
    // Sync with server truth
    const index = todos.value.findIndex(t => t.id === data.id)
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], done: data.done }
    }
  },
  onError() {
    // optimisticData automatically rolls back
  },
})

const displayTodos = computed(() =>
  (optimisticAction.optimisticData.value as typeof todos.value) ?? todos.value,
)

const doneCount = computed(() => displayTodos.value.filter(t => t.done).length)
</script>

<template>
  <div>
    <h1>Optimistic Updates</h1>
    <p>Toggle todo status with instant UI feedback. Changes appear immediately while the server confirms.</p>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem">
        <h3>Todos</h3>
        <span class="badge green">{{ doneCount }}/{{ displayTodos.length }} done</span>
      </div>

      <ul class="todo-list">
        <li v-for="todo in displayTodos" :key="todo.id" class="todo-item">
          <label class="todo-label">
            <input
              type="checkbox"
              :checked="todo.done"
              @change="optimisticAction.execute({ id: todo.id, done: !todo.done })"
            >
            <span :class="{ done: todo.done }">{{ todo.title }}</span>
          </label>
          <span class="badge" :class="todo.done ? 'green' : 'gray'">
            {{ todo.done ? 'Done' : 'Pending' }}
          </span>
        </li>
      </ul>

      <p v-if="optimisticAction.error.value" class="error" style="margin-top: 0.75rem">
        {{ optimisticAction.error.value.message }} (rolled back)
      </p>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">How It Works</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem">
        The checkbox updates <strong>instantly</strong> via <code>updateFn</code>.
        The server has a 500ms simulated delay. If the server rejects the change,
        <code>optimisticData</code> automatically rolls back to the previous state.
      </p>
      <pre style="margin-top: 0.75rem">{{ JSON.stringify({
        status: optimisticAction.status.value,
        isExecuting: optimisticAction.isExecuting.value,
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.done {
  text-decoration: line-through;
  color: var(--text-muted);
}
</style>
