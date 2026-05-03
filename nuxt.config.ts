// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  ssr: false, // CSR mode

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  app: {
    head: {
      title: 'PlaneWatch — Flight Status Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track real-time flight status by flight code' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/plane.svg',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    // Override at runtime with NUXT_AERODATABOX_RAPID_API_KEY.
    // Do not read process.env here, because Netlify secret scanning can detect
    // build-time env values serialized into Nitro output.
    aerodataboxRapidApiKey: '',
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },
})
