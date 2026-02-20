<script setup lang="ts">
const demos = [
  {
    title: 'CRUD Actions',
    description: 'Create, list, and delete todos with E2E typed action references from #actions.',
    path: '/actions',
    badge: 'useAction',
  },
  {
    title: 'Optimistic Updates',
    description: 'Toggle todo status with instant UI feedback and automatic rollback on server error.',
    path: '/optimistic',
    badge: 'useOptimisticAction',
  },
  {
    title: 'Streaming',
    description: 'AI-style text streaming via Server-Sent Events with real-time chunk updates.',
    path: '/streaming',
    badge: 'useStreamAction',
  },
  {
    title: 'SSR Queries',
    description: 'Server-rendered queries with reactive filtering and automatic re-fetching.',
    path: '/queries',
    badge: 'useActionQuery',
  },
  {
    title: 'Middleware & Auth',
    description: 'Authentication flow with chained middleware, field validation, and error handling.',
    path: '/middleware',
    badge: 'defineMiddleware',
  },
  {
    title: 'Builder Pattern',
    description: 'Compose actions with shared middleware using createActionClient().',
    path: '/builder',
    badge: 'createActionClient',
  },
  {
    title: 'Error Handling',
    description: 'Typed errors with field-level details, custom error codes, and graceful recovery.',
    path: '/errors',
    badge: 'createActionError',
  },
]
</script>

<template>
  <div>
    <h1>nuxt-actions Examples</h1>
    <p>Real-world demos showcasing every feature of the module.</p>

    <div class="grid">
      <NuxtLink v-for="demo in demos" :key="demo.path" :to="demo.path" class="demo-card card">
        <div class="demo-header">
          <h3>{{ demo.title }}</h3>
          <span class="badge green">{{ demo.badge }}</span>
        </div>
        <p>{{ demo.description }}</p>
      </NuxtLink>
    </div>

    <div class="card" style="margin-top: 2rem; text-align: center">
      <p style="color: var(--text-muted); font-size: 0.875rem;">
        Install:
        <code style="background: var(--bg); padding: 0.25rem 0.5rem; border-radius: 4px;">
          npx nuxi module add nuxt-actions
        </code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.demo-card {
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s;
}

.demo-card:hover {
  border-color: var(--brand);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.demo-header h3 {
  font-size: 1rem;
}

.demo-card p {
  color: var(--text-muted);
  font-size: 0.8125rem;
}
</style>
