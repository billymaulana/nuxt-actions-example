export default defineNuxtConfig({
  modules: ['nuxt-actions'],
  devtools: { enabled: true },

  app: {
    head: {
      title: 'nuxt-actions playground',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  compatibilityDate: 'latest',

  actions: {
    openapi: {
      ui: true,
      info: { title: 'nuxt-actions example API', version: '1.2.0' },
    },
  },
})
