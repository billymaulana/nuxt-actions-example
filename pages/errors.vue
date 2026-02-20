<script setup lang="ts">
import { createTodo, deleteTodo } from '#actions'

// Test 1: Validation error (empty title)
const validationAction = useAction(createTodo)

// Test 2: Not found error (delete non-existent todo)
const notFoundAction = useAction(deleteTodo)

// Test 3: Custom typed error scenario
const customAction = useAction(createTodo)

const validationErrors = computed(() => {
  const err = validationAction.error.value
  if (!err?.fieldErrors) return {}
  return err.fieldErrors as Record<string, string[]>
})
</script>

<template>
  <div>
    <h1>Error Handling</h1>
    <p>Typed errors with field-level details, custom error codes, and graceful recovery.</p>

    <!-- Validation Error -->
    <div class="card">
      <h3 style="margin-bottom: 0.75rem">1. Validation Error</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem; margin-bottom: 0.75rem">
        Submit an empty title to trigger Zod validation with field-level errors.
      </p>
      <button
        :disabled="validationAction.isExecuting.value"
        @click="validationAction.execute({ title: '' })"
      >
        Submit Empty Title
      </button>
      <div v-if="validationAction.error.value" style="margin-top: 0.75rem">
        <p class="error">
          <span class="badge red">{{ validationAction.error.value.code }}</span>
          {{ validationAction.error.value.message }}
        </p>
        <div v-if="Object.keys(validationErrors).length" style="margin-top: 0.5rem">
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem">Field errors:</p>
          <pre>{{ JSON.stringify(validationErrors, null, 2) }}</pre>
        </div>
      </div>
      <div v-if="validationAction.hasSucceeded.value" class="success" style="margin-top: 0.5rem">
        Unexpected success!
      </div>
    </div>

    <!-- Not Found Error -->
    <div class="card">
      <h3 style="margin-bottom: 0.75rem">2. Not Found Error</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem; margin-bottom: 0.75rem">
        Delete a todo that doesn't exist (ID: 99999) to trigger a custom NOT_FOUND error.
      </p>
      <button
        :disabled="notFoundAction.isExecuting.value"
        @click="notFoundAction.execute({ id: 99999 })"
      >
        Delete Non-Existent Todo
      </button>
      <div v-if="notFoundAction.error.value" style="margin-top: 0.75rem">
        <p class="error">
          <span class="badge red">{{ notFoundAction.error.value.code }}</span>
          {{ notFoundAction.error.value.message }}
        </p>
        <pre style="margin-top: 0.5rem">{{ JSON.stringify({
          code: notFoundAction.error.value.code,
          message: notFoundAction.error.value.message,
          statusCode: notFoundAction.error.value.statusCode,
        }, null, 2) }}</pre>
      </div>
    </div>

    <!-- Reset and recovery -->
    <div class="card">
      <h3 style="margin-bottom: 0.75rem">3. Error Recovery</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem; margin-bottom: 0.75rem">
        After triggering an error above, use <code>reset()</code> to clear the error state and try again.
      </p>
      <div style="display: flex; gap: 0.5rem">
        <button class="secondary" @click="validationAction.reset()">
          Reset Validation
        </button>
        <button class="secondary" @click="notFoundAction.reset()">
          Reset Not Found
        </button>
      </div>
      <pre style="margin-top: 0.75rem">{{ JSON.stringify({
        validation: { status: validationAction.status.value, hasError: !!validationAction.error.value },
        notFound: { status: notFoundAction.status.value, hasError: !!notFoundAction.error.value },
      }, null, 2) }}</pre>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">Error Format</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem; margin-bottom: 0.75rem">
        All errors follow a consistent format. Validation errors include <code>fieldErrors</code>,
        custom errors use <code>createActionError</code> with your own codes.
      </p>
      <pre>// Server: validation error format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "statusCode": 422,
    "fieldErrors": {
      "title": ["Title is required"]
    }
  }
}

// Server: custom error
throw createActionError({
  code: 'NOT_FOUND',
  message: 'Todo not found',
  statusCode: 404,
})</pre>
    </div>
  </div>
</template>
