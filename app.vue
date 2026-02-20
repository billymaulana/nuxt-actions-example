<template>
  <div id="app">
    <header>
      <nav>
        <NuxtLink to="/" class="brand">nuxt-actions</NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/actions">Actions</NuxtLink>
          <NuxtLink to="/optimistic">Optimistic</NuxtLink>
          <NuxtLink to="/streaming">Streaming</NuxtLink>
          <NuxtLink to="/queries">Queries</NuxtLink>
          <NuxtLink to="/middleware">Middleware</NuxtLink>
          <NuxtLink to="/builder">Builder</NuxtLink>
          <NuxtLink to="/errors">Errors</NuxtLink>
        </div>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
:root {
  --bg: #0a0a0a;
  --surface: #141414;
  --border: #2a2a2a;
  --text: #e5e5e5;
  --text-muted: #888;
  --brand: #00dc82;
  --brand-dim: #00dc8233;
  --error: #ef4444;
  --error-dim: #ef444433;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

header {
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  overflow-x: auto;
}

.brand {
  color: var(--brand);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.15s;
  white-space: nowrap;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--brand);
  background: var(--brand-dim);
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

h1 + p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 100%;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--brand);
}

button {
  background: var(--brand);
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

button:hover:not(:disabled) {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
}

.error {
  color: var(--error);
  font-size: 0.8125rem;
}

.success {
  color: var(--brand);
  font-size: 0.8125rem;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.green {
  background: var(--brand-dim);
  color: var(--brand);
}

.badge.red {
  background: var(--error-dim);
  color: var(--error);
}

.badge.gray {
  background: #333;
  color: var(--text-muted);
}

pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.field-error {
  color: var(--error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>
