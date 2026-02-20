<script setup lang="ts">
import { generateText } from '#actions'

const prompt = ref('Tell me about type safety')
const streamAction = useStreamAction(generateText)

async function handleSubmit() {
  if (!prompt.value.trim()) return
  await streamAction.execute({ prompt: prompt.value })
}

const displayText = computed(() =>
  (streamAction.chunks.value as Array<{ text: string }>)
    .map(c => c.text)
    .join(''),
)
</script>

<template>
  <div>
    <h1>Streaming</h1>
    <p>AI-style text streaming via Server-Sent Events with real-time chunk updates.</p>

    <div class="card">
      <h3 style="margin-bottom: 0.75rem">Prompt</h3>
      <form style="display: flex; gap: 0.5rem" @submit.prevent="handleSubmit">
        <input
          v-model="prompt"
          type="text"
          placeholder="Ask anything..."
          style="flex: 1"
          :disabled="streamAction.status.value === 'streaming'"
        >
        <button
          v-if="streamAction.status.value !== 'streaming'"
          :disabled="!prompt.trim()"
        >
          Stream
        </button>
        <button
          v-else
          class="secondary"
          type="button"
          @click="streamAction.stop()"
        >
          Stop
        </button>
      </form>
    </div>

    <div v-if="displayText || streamAction.status.value === 'streaming'" class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem">
        <h3>Response</h3>
        <span
          class="badge"
          :class="{
            green: streamAction.status.value === 'done',
            gray: streamAction.status.value === 'streaming',
          }"
        >
          {{ streamAction.status.value }}
        </span>
      </div>
      <div class="stream-output">
        {{ displayText }}<span v-if="streamAction.status.value === 'streaming'" class="cursor">|</span>
      </div>
      <p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.75rem">
        {{ (streamAction.chunks.value as unknown[]).length }} chunks received
      </p>
    </div>

    <div v-if="streamAction.error.value" class="card">
      <p class="error">{{ streamAction.error.value.message }}</p>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 0.5rem">How It Works</h3>
      <p style="color: var(--text-muted); font-size: 0.8125rem">
        The server uses <code>defineStreamAction</code> with an SSE event stream.
        Each word is sent as a separate chunk via <code>stream.send()</code>.
        The client uses <code>useStreamAction</code> which provides reactive
        <code>chunks</code>, <code>status</code>, and a <code>stop()</code> method.
      </p>
    </div>
  </div>
</template>

<style scoped>
.stream-output {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  line-height: 1.8;
  min-height: 80px;
}

.cursor {
  animation: blink 0.7s infinite;
  color: var(--brand);
  font-weight: bold;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
