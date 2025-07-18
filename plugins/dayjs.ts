import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

export default defineNuxtPlugin(() => {
  // Extend dayjs with the plugins we need
  dayjs.extend(updateLocale)
  dayjs.extend(relativeTime)
  dayjs.extend(utc)

  // We provide dayjs instance to the Nuxt app.
  // It will be available as $dayjs in templates and `useNuxtApp().$dayjs` in scripts.
  return {
    provide: {
      dayjs,
    },
  }
}) 