import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-actions advanced features', async () => {
  await setup({
    server: true,
  })

  it('login succeeds with valid credentials', async () => {
    const res = await $fetch('/api/_actions/login', {
      method: 'POST',
      body: { email: 'admin@example.com', password: 'password123' },
    })
    expect(res.success).toBe(true)
    expect(res.data.user.email).toBe('admin@example.com')
    expect(res.data.token).toBe('demo-jwt-token')
    expect(res.data.meta).toHaveProperty('requestTime')
    expect(res.data.meta).toHaveProperty('rateLimitRemaining')
  })

  it('login fails with invalid credentials', async () => {
    const res = await $fetch('/api/_actions/login', {
      method: 'POST',
      body: { email: 'wrong@example.com', password: 'wrongpassword' },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('INVALID_CREDENTIALS')
    expect(res.error.statusCode).toBe(401)
  })

  it('login validates email format', async () => {
    const res = await $fetch('/api/_actions/login', {
      method: 'POST',
      body: { email: 'not-an-email', password: 'password123' },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('login validates password length', async () => {
    const res = await $fetch('/api/_actions/login', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'short' },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('update-profile succeeds with valid input', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'John Doe', bio: 'A developer' },
    })
    expect(res.success).toBe(true)
    expect(res.data.name).toBe('John Doe')
    expect(res.data.bio).toBe('A developer')
    expect(res.data).toHaveProperty('id')
    expect(res.data).toHaveProperty('updatedAt')
  })

  it('update-profile works without optional bio', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'Jane Doe' },
    })
    expect(res.success).toBe(true)
    expect(res.data.name).toBe('Jane Doe')
    expect(res.data.bio).toBe('')
  })

  it('update-profile rejects short name', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'J' },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('update-profile rejects overly long bio', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'John', bio: 'a'.repeat(201) },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('handles missing body gracefully', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })
})
