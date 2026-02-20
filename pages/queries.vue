<script setup lang="ts">
import { searchTodos } from '#actions'

const search = ref('')

const { data, pending, error, refresh } = useActionQuery(
  searchTodos,
  () => ({ q: search.value }),
)
</script>

<template>
  <div>
    <h1>SSR Queries</h1>
    <p>Server-rendered queries with reactive filtering. Data is fetched on the server and re-fetched reactively.</p>

    <div class="card">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
        <input
          v-model="search"
          type="text"
          placeholder="Search todos..."
          style="flex: 1"
        >
        <button class="secondary" :disabled="pending" @click="refresh()">
          {{ pending ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="pending && !data" style="color: var(--text-muted)">Loading...</div>

      <template v-else-if="data">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem">
          <span class="badge green">{{ data.total }} results</span>
          <span v-if="data.query" style="color: var(--text-muted); font-size: 0.75rem">
            Searching: "{{ data.query }}"
          </span>
        </div>

        <ul v-if="data.items.length" class="todo-list">
          <li v-for="todo in data.items" :key="todo.id" class="todo-item">
            <span :class="{ done: todo.done }">{{ todo.title }}</span>
            <span class="badge" :class="todo.done ? 'green' : 'gray'">
              {{ todo.done ? 'Done' : 'Pending' }}
            </span>
          </li>
        </ul>
        <div v-else style="color: var(--text-muted)">No matching todos.</div>
      </template>

      <p v-if="error" class="error" style="margin-top: 0.5rem">
        {{ (error as Error).message }}
      </p>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">How It Works</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem">
        <code>useActionQuery</code> wraps <code>useAsyncData</code> for SSR-compatible data fetching.
        The second argument <code>() => ({ q: search.value })</code> is a reactive getter &mdash;
        when <code>search</code> changes, the query automatically re-fetches.
        Data is rendered on the server for the initial page load.
      </p>
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
