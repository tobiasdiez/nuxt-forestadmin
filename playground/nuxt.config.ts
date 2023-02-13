import { createDummyDataSource } from '@forestadmin/datasource-dummy'

export default defineNuxtConfig({
  modules: ['../src/module'],
  forestadmin: {
    dataSource: {
      factory: createDummyDataSource()
    },
    authSecret: '2536a2f786fc98a1ee62f9e9f405ff2521181cd01e15adcc',
    envSecret: '61a31971206f285c3e8eb8f3ee420175eb004bfa9fa24846dde6d5dd438e3991',
    forestServerUrl: 'https://api.development.forestadmin.com'
  },
})
