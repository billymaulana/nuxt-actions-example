<script setup lang="ts">
import { login } from '#actions'

const email = ref('')
const password = ref('')

const loginAction = useAction(login, {
  onSuccess(data) {
    console.log('Login successful:', data)
  },
})

async function handleLogin() {
  await loginAction.execute({ email: email.value, password: password.value })
}

const fieldErrors = computed(() => {
  const err = loginAction.error.value
  if (!err?.fieldErrors) return {}
  return err.fieldErrors as Record<string, string[]>
})
</script>

<template>
  <div>
    <h1>Middleware & Auth</h1>
    <p>Authentication flow with chained middleware, field validation, and error handling.</p>

    <div class="card">
      <h3 style="margin-bottom: 0.75rem">Login</h3>
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 0.75rem">
          <input
            v-model="email"
            type="email"
            placeholder="Email (try admin@example.com)"
          >
          <p v-if="fieldErrors.email" class="field-error">
            {{ fieldErrors.email[0] }}
          </p>
        </div>

        <div style="margin-bottom: 0.75rem">
          <input
            v-model="password"
            type="password"
            placeholder="Password (try password123)"
          >
          <p v-if="fieldErrors.password" class="field-error">
            {{ fieldErrors.password[0] }}
          </p>
        </div>

        <button :disabled="loginAction.isExecuting.value">
          {{ loginAction.isExecuting.value ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p
        v-if="loginAction.error.value && !Object.keys(fieldErrors).length"
        class="error"
        style="margin-top: 0.75rem"
      >
        {{ loginAction.error.value.message }}
        <span class="badge red" style="margin-left: 0.5rem">{{ loginAction.error.value.code }}</span>
      </p>
    </div>

    <!-- Success result -->
    <div v-if="loginAction.hasSucceeded.value && loginAction.data.value" class="card">
      <h3 style="margin-bottom: 0.5rem; color: var(--brand)">Login Successful</h3>
      <pre>{{ JSON.stringify(loginAction.data.value, null, 2) }}</pre>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">How It Works</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem">
        The <code>login</code> action uses two chained middleware:
        <code>logMiddleware</code> (tracks timing) and <code>rateLimitMiddleware</code>
        (simulates rate limits). Each middleware adds typed context via <code>next({ ctx: { ... } })</code>.
        The handler receives the accumulated context. Field-level validation errors
        from Zod are automatically formatted into <code>fieldErrors</code>.
      </p>
      <p style="color: var(--text-muted); font-size: 0.8125rem; margin-top: 0.5rem">
        <strong>Try:</strong> Submit with empty fields (Zod validation),
        or wrong credentials (<code>createActionError</code> with INVALID_CREDENTIALS code).
      </p>
    </div>
  </div>
</template>
