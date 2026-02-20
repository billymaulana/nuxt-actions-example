import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-actions CRUD', async () => {
  await setup({
    server: true,
  })

  it('lists initial todos', async () => {
    const res = await $fetch('/api/_actions/list-todos')
    expect(res.success).toBe(true)
    expect(res.data).toHaveProperty('items')
    expect(res.data).toHaveProperty('total')
    expect(res.data.items.length).toBeGreaterThanOrEqual(3)
    expect(res.data.total).toBe(res.data.items.length)
  })

  it('creates a todo with valid input', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 'Integration test todo' },
    })
    expect(res.success).toBe(true)
    expect(res.data).toHaveProperty('id')
    expect(res.data.title).toBe('Integration test todo')
    expect(res.data.done).toBe(false)
    expect(res.data).toHaveProperty('createdAt')
  })

  it('rejects creating a todo with empty title', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: '' },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects creating a todo with title over 100 chars', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 'a'.repeat(101) },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('deletes a todo that exists', async () => {
    const createRes = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 'To be deleted' },
    })

    const res = await $fetch('/api/_actions/delete-todo', {
      method: 'POST',
      body: { id: createRes.data.id },
    })
    expect(res.success).toBe(true)
    expect(res.data.deleted.id).toBe(createRes.data.id)
  })

  it('returns NOT_FOUND when deleting non-existent todo', async () => {
    const res = await $fetch('/api/_actions/delete-todo', {
      method: 'POST',
      body: { id: 999999 },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('NOT_FOUND')
    expect(res.error.statusCode).toBe(404)
  })

  it('toggles a todo', async () => {
    const res = await $fetch('/api/_actions/toggle-todo', {
      method: 'POST',
      body: { id: 1, done: true },
    })
    expect(res.success).toBe(true)
    expect(res.data.id).toBe(1)
    expect(res.data.done).toBe(true)
    expect(res.data).toHaveProperty('updatedAt')
  })

  it('returns NOT_FOUND when toggling non-existent todo', async () => {
    const res = await $fetch('/api/_actions/toggle-todo', {
      method: 'POST',
      body: { id: 999999, done: true },
    })

    expect(res.success).toBe(false)
    expect(res.error.code).toBe('NOT_FOUND')
  })

  it('searches todos with query', async () => {
    const res = await $fetch('/api/_actions/search-todos?q=Nuxt')
    expect(res.success).toBe(true)
    expect(res.data).toHaveProperty('items')
    expect(res.data).toHaveProperty('total')
    expect(res.data).toHaveProperty('query')
    expect(res.data.items.length).toBeGreaterThanOrEqual(1)
  })

  it('returns all todos when search query is empty', async () => {
    const res = await $fetch('/api/_actions/search-todos')
    expect(res.success).toBe(true)
    expect(res.data.items.length).toBeGreaterThanOrEqual(3)
  })
})
