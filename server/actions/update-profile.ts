import { z } from 'zod'

// Reusable auth middleware
const authMiddleware = defineMiddleware(async ({ next }) => {
  // In production: validate JWT, session, etc.
  return next({ ctx: { userId: 1, role: 'admin' as const } })
})

// Builder pattern: create a shared action client with middleware
const authClient = createActionClient()
  .use(authMiddleware)

export default authClient
  .schema(z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  }))
  .metadata({ action: 'update-profile', requiresAuth: true })
  .action(async ({ input, ctx }) => {
    // Simulate profile update
    await new Promise(r => setTimeout(r, 200))
    return {
      id: (ctx as Record<string, unknown>).userId,
      name: input.name,
      bio: input.bio || '',
      updatedAt: new Date().toISOString(),
    }
  })
