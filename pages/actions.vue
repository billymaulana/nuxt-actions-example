<script setup lang="ts">
import { createTodo, listTodos, deleteTodo } from '#actions'

const todoTitle = ref('')

// Create a new todo
const createAction = useAction(createTodo, {
  onSuccess() {
    todoTitle.value = ''
    // Re-fetch list after creation
    listAction.execute(undefined as never)
  },
})

// List all todos
const listAction = useAction(listTodos)

// Delete a todo
const deleteAction = useAction(deleteTodo, {
  onSuccess() {
    listAction.execute(undefined as never)
  },
})

// Fetch on mount
onMounted(() => {
  listAction.execute(undefined as never)
})
</script>

<template>
  <div>
    <h1>CRUD Actions</h1>
    <p>Create, list, and delete todos using E2E typed action references.</p>

    <!-- Create form -->
    <div class="card">
      <h3 style="margin-bottom: 0.75rem">Create Todo</h3>
      <form
        style="display: flex; gap: 0.5rem"
        @submit.prevent="createAction.execute({ title: todoTitle })"
      >
        <input
          v-model="todoTitle"
          type="text"
          placeholder="What needs to be done?"
          style="flex: 1"
        >
        <button :disabled="createAction.isExecuting.value || !todoTitle.trim()">
          {{ createAction.isExecuting.value ? 'Creating...' : 'Add' }}
        </button>
      </form>
      <p v-if="createAction.error.value" class="error" style="margin-top: 0.5rem">
        {{ createAction.error.value.message }}
      </p>
      <p v-if="createAction.hasSucceeded.value" class="success" style="margin-top: 0.5rem">
        Created: {{ createAction.data.value?.title }}
      </p>
    </div>

    <!-- Todo list -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem">
        <h3>Todos</h3>
        <button class="secondary" :disabled="listAction.isExecuting.value" @click="listAction.execute(undefined as never)">
          {{ listAction.isExecuting.value ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="listAction.isExecuting.value && !listAction.data.value" style="color: var(--text-muted)">
        Loading...
      </div>

      <ul v-else-if="listAction.data.value?.items?.length" class="todo-list">
        <li v-for="todo in listAction.data.value.items" :key="todo.id" class="todo-item">
          <span :class="{ done: todo.done }">{{ todo.title }}</span>
          <div style="display: flex; gap: 0.5rem; align-items: center">
            <span class="badge" :class="todo.done ? 'green' : 'gray'">
              {{ todo.done ? 'Done' : 'Pending' }}
            </span>
            <button
              class="secondary"
              style="padding: 0.25rem 0.5rem; font-size: 0.75rem"
              @click="deleteAction.execute({ id: todo.id })"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div v-else style="color: var(--text-muted)">No todos found.</div>

      <p v-if="listAction.error.value" class="error" style="margin-top: 0.5rem">
        {{ listAction.error.value.message }}
      </p>
    </div>

    <!-- Status info -->
    <div class="card">
      <h3 style="margin-bottom: 0.5rem">Reactive Status</h3>
      <pre>{{ JSON.stringify({
        create: { status: createAction.status.value, isExecuting: createAction.isExecuting.value },
        list: { status: listAction.status.value, total: listAction.data.value?.total },
        delete: { status: deleteAction.status.value },
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

.done {
  text-decoration: line-through;
  color: var(--text-muted);
}
</style>
