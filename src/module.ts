import {
  addServerHandler,
  createResolver,
  defineNuxtModule,
  resolveAlias,
  useLogger,
} from '@nuxt/kit'
import type { DataSourceOptions } from '@forestadmin/datasource-customizer'
import type { DataSourceFactory } from '@forestadmin/datasource-toolkit'

export interface ModuleOptions {
  dataSource?: string
  authSecret?: string
  envSecret?: string
  forestServerUrl?: string
}

export interface ForestAdminDataSource {
  factory: DataSourceFactory
  options?: DataSourceOptions
}

declare module '@nuxt/schema' {
  export interface RuntimeConfig {
    forestAdmin: Partial<ModuleOptions>
  }
}
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type Options = WithRequired<
  WithRequired<ModuleOptions, 'authSecret'>,
  'envSecret'
> & { isDev: boolean }

const logger = useLogger('forestadmin')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-forestadmin',
    configKey: 'forestadmin',
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    const options = {
      ...moduleOptions,
      ...nuxt.options.runtimeConfig.forestAdmin,
      isDev: nuxt.options.dev,
    }
    if (!options.authSecret || !options.envSecret) {
      logger.warn(
        'Forest Admin is not configured. Please set the authSecret and envSecret.'
      )
      return
    }
    nuxt.options.runtimeConfig.forestAdmin = options
    if (options.dataSource) {
      nuxt.options.alias['#forestadmin/datasource'] = resolveAlias(
        options.dataSource
      )
    }
    addServerHandler({
      route: '/_admin',
      handler: resolver.resolve('./runtime/server-handler.ts'),
    })

    // Without this, vite would handle cors in dev mode, which would lead to different behavior in dev and prod
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.cors = config.server.cors || {}
      if (typeof config.server.cors !== 'boolean') {
        config.server.cors.preflightContinue = true
      } else {
        logger.error(
          'Cannot set preflightContinue in cors vite config, do this manually'
        )
      }
    })
  },
})
