<template>
  <div>
    <h1>Security Middleware</h1>
    <h2>Built-in rateLimitMiddleware and csrfMiddleware</h2>

    <!-- Rate Limiting -->
    <section>
      <h3 style="margin-bottom: 8px;">
        Rate Limiting
      </h3>
      <p style="color: #666; font-size: 13px; margin-bottom: 8px;">
        This action is limited to 5 requests per 10 seconds. Click rapidly to trigger a 429 error.
      </p>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button
          :disabled="rateLimitAction.isExecuting.value"
          @click="handleRateLimit"
        >
          {{ rateLimitAction.isExecuting.value ? 'Sending...' : 'Send Request' }}
        </button>
        <span style="font-size: 13px; color: #a3a3a3;">
          Sent: {{ requestCount }} | Remaining: {{ Math.max(0, 5 - requestCount) }}
        </span>
      </div>

      <div
        v-if="rateLimitAction.hasSucceeded.value"
        class="success"
      >
        Echo: {{ rateLimitAction.data.value.echo }} ({{ new Date(rateLimitAction.data.value.timestamp).toLocaleTimeString() }})
      </div>

      <div
        v-if="rateLimitAction.hasErrored.value"
        class="error"
      >
        {{ rateLimitAction.error.value?.statusCode }} — {{ rateLimitAction.error.value?.message }}
      </div>

      <div
        v-if="resetCountdown > 0"
        style="margin-top: 8px; font-size: 13px; color: #fb923c;"
      >
        Window resets in {{ resetCountdown }}s
      </div>

      <pre>// server/actions/rate-limited-action.post.ts
export default defineAction({
  input: z.object({ message: z.string() }),
  middleware: [
    rateLimitMiddleware({
      limit: 5,
      window: 10000,
      message: 'Too many requests, wait 10 seconds',
    }),
  ],
  handler: async ({ input }) => {
    return { echo: input.message, timestamp: Date.now() }
  },
})</pre>
    </section>

    <!-- CSRF Protection -->
    <section>
      <h3 style="margin-bottom: 8px;">
        CSRF Protection
      </h3>
      <p style="color: #666; font-size: 13px; margin-bottom: 8px;">
        The csrfMiddleware generates a token cookie on safe requests and validates it on mutations.
        The client reads the cookie and sends the token in the <code>x-csrf-token</code> header.
      </p>

      <div style="background: #111; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 13px;">
          <span style="color: #a3a3a3;">Flow:</span>
          <span style="color: #e5e5e5;">1. Server sets <code style="color: #60a5fa;">_csrf</code> cookie with a random token</span>
          <span />
          <span style="color: #e5e5e5;">2. Client reads cookie value</span>
          <span />
          <span style="color: #e5e5e5;">3. Client sends token in <code style="color: #60a5fa;">x-csrf-token</code> header</span>
          <span />
          <span style="color: #e5e5e5;">4. Server compares cookie vs header (timing-safe)</span>
        </div>
      </div>

      <pre>// Usage in an action
export default defineAction({
  input: z.object({ title: z.string() }),
  middleware: [
    csrfMiddleware({
      cookieName: '_csrf',        // default
      headerName: 'x-csrf-token', // default
      tokenLength: 32,            // default
    }),
  ],
  handler: async ({ input }) => {
    return db.createPost(input)
  },
})</pre>
    </section>

    <!-- Combined -->
    <section>
      <h3 style="margin-bottom: 8px;">
        Composing Middleware
      </h3>
      <p style="color: #666; font-size: 13px; margin-bottom: 8px;">
        Middleware can be chained — apply rate limiting AND CSRF protection together.
      </p>
      <pre>export default defineAction({
  input: z.object({ amount: z.number() }),
  middleware: [
    rateLimitMiddleware({ limit: 10, window: 60000 }),
    csrfMiddleware(),
  ],
  handler: async ({ input }) => {
    return payments.charge(input.amount)
  },
})</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { rateLimitedAction } from '#actions'

const requestCount = ref(0)
const resetCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let windowStart = 0

const rateLimitAction = useAction(rateLimitedAction, {
  onError() {
    // Start countdown when rate limited
    if (!countdownTimer) {
      const elapsed = Date.now() - windowStart
      const remaining = Math.ceil((10000 - elapsed) / 1000)
      resetCountdown.value = Math.max(remaining, 1)
      countdownTimer = setInterval(() => {
        resetCountdown.value--
        if (resetCountdown.value <= 0) {
          clearInterval(countdownTimer!)
          countdownTimer = null
          requestCount.value = 0
        }
      }, 1000)
    }
  },
})

function handleRateLimit() {
  if (requestCount.value === 0) {
    windowStart = Date.now()
  }
  requestCount.value++
  rateLimitAction.execute({ message: `Request #${requestCount.value}` })
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>
