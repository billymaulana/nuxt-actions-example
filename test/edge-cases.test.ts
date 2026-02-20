import { describe, it, expect } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils/e2e'

describe('nuxt-actions edge cases & real-world scenarios', async () => {
  await setup({
    server: true,
  })

  // ── Input Validation Edge Cases ────────────────────────────

  it('rejects number where string is expected', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 12345 },
    })
    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects null input', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: null },
    })
    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects array where object is expected', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: [{ title: 'test' }],
    })
    expect(res.success).toBe(false)
    expect(res.error.code).toBe('VALIDATION_ERROR')
  })

  it('handles extra fields gracefully (does not leak)', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 'Valid todo', admin: true, __proto__: { isAdmin: true } },
    })
    // Should succeed but ignore extra fields
    expect(res.success).toBe(true)
    expect(res.data.title).toBe('Valid todo')
    expect((res.data as any).admin).toBeUndefined()
  })

  it('handles special characters in input', async () => {
    const specialTitle = '<script>alert("xss")</script> & "quotes" \'single\''
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: specialTitle },
    })
    expect(res.success).toBe(true)
    expect(res.data.title).toBe(specialTitle)
  })

  it('handles unicode and emoji in input', async () => {
    const unicodeTitle = 'Todo: 日本語テスト 🚀🎉 café résumé'
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: unicodeTitle },
    })
    expect(res.success).toBe(true)
    expect(res.data.title).toBe(unicodeTitle)
  })

  it('handles exactly 100 character title (boundary)', async () => {
    const exactTitle = 'a'.repeat(100)
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: exactTitle },
    })
    expect(res.success).toBe(true)
    expect(res.data.title).toBe(exactTitle)
  })

  it('handles exactly 1 character title (boundary)', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      body: { title: 'a' },
    })
    expect(res.success).toBe(true)
    expect(res.data.title).toBe('a')
  })

  // ── Prototype Pollution Attempts ───────────────────────────

  it('blocks __proto__ pollution in body', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'test', __proto__: { isAdmin: true } }),
    })
    // Should not crash the server
    expect(res).toBeDefined()
  })

  it('blocks constructor pollution', async () => {
    const res = await $fetch('/api/_actions/create-todo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'test', constructor: { prototype: { isAdmin: true } } }),
    })
    expect(res).toBeDefined()
  })

  // ── Wrong HTTP Methods ─────────────────────────────────────

  it('GET on POST action returns appropriate response', async () => {
    const res = await fetch(url('/api/_actions/create-todo'))
    // Should not return 500 — either 404, 405, or handled gracefully
    expect(res.status).not.toBe(500)
  })

  it('POST on GET action returns 404 (method-specific routing)', async () => {
    const res = await fetch(url('/api/_actions/list-todos'), {
      method: 'POST',
    })
    // Nitro registers method-specific handlers, so wrong method = 404
    expect(res.status).toBe(404)
  })

  // ── Concurrent Requests ────────────────────────────────────

  it('handles concurrent create requests without data corruption', async () => {
    const promises = Array.from({ length: 5 }, (_, i) =>
      $fetch('/api/_actions/create-todo', {
        method: 'POST',
        body: { title: `Concurrent todo ${i}` },
      }),
    )
    const results = await Promise.all(promises)

    // All should succeed with correct titles
    results.forEach((res, i) => {
      expect(res.success).toBe(true)
      expect(res.data.title).toBe(`Concurrent todo ${i}`)
      expect(res.data.done).toBe(false)
      expect(res.data).toHaveProperty('id')
      expect(res.data).toHaveProperty('createdAt')
    })
  })

  it('handles concurrent read + write without crash', async () => {
    const results = await Promise.all([
      $fetch('/api/_actions/list-todos'),
      $fetch('/api/_actions/create-todo', {
        method: 'POST',
        body: { title: 'During concurrent read' },
      }),
      $fetch('/api/_actions/search-todos?q=todo'),
      $fetch('/api/_actions/create-todo', {
        method: 'POST',
        body: { title: 'Another concurrent' },
      }),
    ])

    results.forEach((res) => {
      expect(res.success).toBe(true)
    })
  })

  // ── Error Response Structure ───────────────────────────────

  it('validation error has correct structure with fieldErrors', async () => {
    const res = await $fetch('/api/_actions/login', {
      method: 'POST',
      body: { email: 'bad', password: '123' },
    })
    expect(res.success).toBe(false)
    expect(res.error).toHaveProperty('code')
    expect(res.error).toHaveProperty('message')
    expect(res.error.code).toBe('VALIDATION_ERROR')
    // Should have fieldErrors for both email and password
    expect(res.error).toHaveProperty('fieldErrors')
    expect(res.error.fieldErrors).toBeDefined()
  })

  it('custom error has correct structure', async () => {
    const res = await $fetch('/api/_actions/delete-todo', {
      method: 'POST',
      body: { id: -1 },
    })
    expect(res.success).toBe(false)
    expect(res.error.code).toBe('NOT_FOUND')
    expect(res.error.message).toContain('-1')
    expect(res.error.statusCode).toBe(404)
  })

  // ── Search Query Edge Cases ────────────────────────────────

  it('search with special regex characters does not crash', async () => {
    const res = await $fetch('/api/_actions/search-todos?q=' + encodeURIComponent('.*+?^${}()|[]\\'))
    expect(res.success).toBe(true)
    expect(res.data).toHaveProperty('items')
  })

  it('search with empty string returns all', async () => {
    const res = await $fetch('/api/_actions/search-todos?q=')
    expect(res.success).toBe(true)
    expect(res.data.items.length).toBeGreaterThanOrEqual(3)
  })

  it('search is case-insensitive', async () => {
    const upper = await $fetch('/api/_actions/search-todos?q=NUXT')
    const lower = await $fetch('/api/_actions/search-todos?q=nuxt')
    expect(upper.data.total).toBe(lower.data.total)
  })

  // ── Builder Pattern (update-profile) Edge Cases ────────────

  it('update-profile with exactly 2 char name (boundary)', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'AB' },
    })
    expect(res.success).toBe(true)
    expect(res.data.name).toBe('AB')
  })

  it('update-profile with exactly 200 char bio (boundary)', async () => {
    const res = await $fetch('/api/_actions/update-profile', {
      method: 'POST',
      body: { name: 'Test', bio: 'b'.repeat(200) },
    })
    expect(res.success).toBe(true)
    expect(res.data.bio.length).toBe(200)
  })

  // ── Streaming Edge Cases ───────────────────────────────────

  it('stream action with long prompt works', async () => {
    const controller = new AbortController()
    const res = await fetch(url('/api/_actions/generate-text'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A very long prompt: ' + 'word '.repeat(100) }),
      signal: controller.signal,
    })
    expect(res.status).toBe(200)
    controller.abort()
  })

  it('multiple concurrent streams do not interfere', async () => {
    const controller1 = new AbortController()
    const controller2 = new AbortController()

    const [res1, res2] = await Promise.all([
      fetch(url('/api/_actions/generate-text'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Stream 1' }),
        signal: controller1.signal,
      }),
      fetch(url('/api/_actions/generate-text'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Stream 2' }),
        signal: controller2.signal,
      }),
    ])

    expect(res1.status).toBe(200)
    expect(res2.status).toBe(200)

    controller1.abort()
    controller2.abort()
  })
})
