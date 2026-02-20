import { z } from 'zod'

export default defineStreamAction({
  input: z.object({
    prompt: z.string().min(1, 'Prompt is required'),
  }),
  handler: async ({ input, stream }) => {
    const response = `Here is a response to "${input.prompt}": The key to building great applications is starting with strong foundations. Type-safe server actions help you catch errors at compile time, reduce bugs in production, and provide an excellent developer experience with auto-completion and inline documentation. With nuxt-actions, you get all of this out of the box with zero configuration.`

    const words = response.split(' ')

    for (const word of words) {
      await stream.send({ text: word + ' ' })
      // Simulate AI token generation delay
      await new Promise(r => setTimeout(r, 60 + Math.random() * 40))
    }

    await stream.close()
  },
})
