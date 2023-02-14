import createTypicode from './datasource'

export default defineNuxtConfig({
  modules: ['../src/module'],
  forestadmin: {
    dataSource: {
      factory: createTypicode()
    },
    authSecret: '2536a2f786fc98a1ee62f9e9f405ff2521181cd01e15adcc',
    envSecret: 'a4e47c2af50f0ca42d01b5d5bea6bccddf2f4a1b3f7a3ee56ba17d3c556aabfe'
  },
})
