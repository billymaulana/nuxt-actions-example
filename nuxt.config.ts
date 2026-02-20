export default defineNuxtConfig({
  modules: ['nuxt-actions'],

  devtools: { enabled: true },

  compatibilityDate: '2025-01-01',

  app: {
    head: {
      title: 'nuxt-actions Example',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-world examples for nuxt-actions' },
      ],
    },
  },
})
