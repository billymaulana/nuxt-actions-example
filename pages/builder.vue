<script setup lang="ts">
import { updateProfile } from '#actions'

const name = ref('')
const bio = ref('')

const profileAction = useAction(updateProfile, {
  onSuccess() {
    // Could reset form, show toast, etc.
  },
})

async function handleSubmit() {
  await profileAction.execute({
    name: name.value,
    bio: bio.value || undefined,
  })
}

const fieldErrors = computed(() => {
  const err = profileAction.error.value
  if (!err?.fieldErrors) return {}
  return err.fieldErrors as Record<string, string[]>
})
</script>

<template>
  <div>
    <h1>Builder Pattern</h1>
    <p>Compose actions with shared middleware using createActionClient().</p>

    <div class="card">
      <h3 style="margin-bottom: 0.75rem">Update Profile</h3>
      <form @submit.prevent="handleSubmit">
        <div style="margin-bottom: 0.75rem">
          <input
            v-model="name"
            type="text"
            placeholder="Display name"
          >
          <p v-if="fieldErrors.name" class="field-error">
            {{ fieldErrors.name[0] }}
          </p>
        </div>

        <div style="margin-bottom: 0.75rem">
          <textarea
            v-model="bio"
            placeholder="Short bio (optional, max 200 chars)"
            rows="3"
          />
          <p v-if="fieldErrors.bio" class="field-error">
            {{ fieldErrors.bio[0] }}
          </p>
        </div>

        <button :disabled="profileAction.isExecuting.value">
          {{ profileAction.isExecuting.value ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>

      <p v-if="profileAction.error.value && !Object.keys(fieldErrors).length" class="error" style="margin-top: 0.75rem">
        {{ profileAction.error.value.message }}
      </p>
    </div>

    <div v-if="profileAction.hasSucceeded.value && profileAction.data.value" class="card">
      <h3 style="margin-bottom: 0.5rem; color: var(--brand)">Profile Updated</h3>
      <pre>{{ JSON.stringify(profileAction.data.value, null, 2) }}</pre>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">How It Works</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem">
        The server action uses <code>createActionClient()</code> to create a reusable
        action client with shared auth middleware. Then chains
        <code>.schema()</code>, <code>.metadata()</code>, and <code>.action()</code>.
      </p>
      <pre style="margin-top: 0.75rem">const authClient = createActionClient()
  .use(authMiddleware)

export default authClient
  .schema(z.object({ name: z.string().min(2) }))
  .metadata({ action: 'update-profile' })
  .action(async ({ input, ctx }) => { ... })</pre>
    </div>
  </div>
</template>
