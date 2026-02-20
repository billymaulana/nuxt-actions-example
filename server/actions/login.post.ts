import { z } from 'zod'

// Middleware: log request timing
const logMiddleware = defineMiddleware(async ({ event, next }) => {
  const start = Date.now()
  const result = await next({ ctx: { requestTime: start } })
  console.log(`[Auth] ${event.method} ${event.path} - ${Date.now() - start}ms`)
  return result
})

// Middleware: simulate rate limiting
const rateLimitMiddleware = defineMiddleware(async ({ next }) => {
  // In production, you'd check a rate limit store (Redis, etc.)
  return next({ ctx: { rateLimitRemaining: 99 } })
})

export default defineAction({
  input: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
  middleware: [logMiddleware, rateLimitMiddleware],
  handler: async ({ input, ctx }) => {
    // Simulate auth check
    await new Promise(r => setTimeout(r, 300))

    if (input.email === 'admin@example.com' && input.password === 'password123') {
      return {
        user: { id: 1, email: input.email, name: 'Admin' },
        token: 'demo-jwt-token',
        meta: {
          requestTime: (ctx as Record<string, unknown>).requestTime,
          rateLimitRemaining: (ctx as Record<string, unknown>).rateLimitRemaining,
        },
      }
    }

    throw createActionError({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
      statusCode: 401,
    })
  },
})
