import { createAgent } from '@forestadmin/agent'
import Router from '@koa/router'
import { addDevServerHandler, defineNuxtModule, useLogger } from '@nuxt/kit'
import Koa from 'koa'
import { defineEventHandler, EventHandler } from 'h3'
import { DataSourceOptions } from '@forestadmin/datasource-customizer'
import { DataSourceFactory } from '@forestadmin/datasource-toolkit'
import { sendError } from 'h3'

type KoaHandler = ReturnType<Koa['callback']>

export interface ModuleOptions {
  dataSource: {
    factory: DataSourceFactory
    options?: DataSourceOptions
  }
  authSecret?: string
  envSecret?: string
  forestServerUrl?: string
}

declare module '@nuxt/schema' {
  export interface RuntimeConfig {
    forestAdmin?: Partial<ModuleOptions>
  }
}
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type Options = WithRequired<
  WithRequired<ModuleOptions, 'authSecret'>,
  'envSecret'
>

const logger = useLogger('forestadmin')
async function startForestAdminServer(options: Options, isDev: boolean) {
  // Create your Forest Admin agent
  const agent = createAgent({
    ...options,
    isProduction: !isDev,
    prefix: '_admin/forest',
    loggerLevel: 'Debug',
    logger: (level, message) => {
      switch (level) {
        case 'Warn':
          logger.warn(message)
          break
        case 'Error':
          logger.error(message)
          break
        default:
          logger.debug(message)
      }
    },
  }).addDataSource(options.dataSource.factory, options.dataSource.options)

  const handlerPromise = new Promise<KoaHandler>((resolve) => {
    // @ts-expect-error: agent.onStart is private
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    agent.onStart.push((driverRouter) => {
      const router = new Router({ prefix: '/forest' }).use(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        driverRouter.routes()
      )
      logger.debug('Routes', router)
      resolve(new Koa().use(router.routes()).callback())
    })
  }).then((handler) => {
    logger.debug('handler started')
    return defineEventHandler((event) => {
      const { req, res } = event.node
      return handler(req, res)
    })
  })
  logger.debug(agent)

  return Promise.all([
    agent.start().then(() => logger.debug('Agent started')),
    handlerPromise,
  ]).then(([, handler]) => {
    logger.debug('Agent and handler started')
    return handler
  })
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-forestadmin',
    configKey: 'forestadmin',
  },
  setup(moduleOptions, nuxt) {
    const options = {
      ...moduleOptions,
      ...nuxt.options.runtimeConfig.forestAdmin,
    }
    if (!options.authSecret || !options.envSecret) {
      logger.warn(
        'Forest Admin is not configured. Please set the authSecret and envSecret.'
      )
      return
    }
    const promiseHandler = new Promise<EventHandler<unknown>>((resolve) => {
      nuxt.hook('listen', async () => {
        try {
          const handler = await startForestAdminServer(
            options as Options,
            nuxt.options.dev
          )
          resolve(handler)
        } catch (error) {
          logger.error(error)
          resolve(
            defineEventHandler((event) => {
              sendError(event, error as Error, nuxt.options.dev)
            })
          )
        }
      })
    })
    /* nuxt.options.runtimeConfig.forestAdmin = {
      handler: promiseHandler,
    } */
    addDevServerHandler({
      route: '/_admin',
      handler: defineEventHandler(async (event) => {
        return (await promiseHandler)(event)
      }),
    })

    // Without this, vite would handle cors in dev mode, which would lead to different behavior in dev and prod
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.cors = config.server.cors || {}
      if (typeof config.server.cors !== 'boolean') {
      config.server.cors.preflightContinue = true
      } else {
        logger.error("Cannot set preflightContinue in cors vite config, do this manually")
      }
    })
  },
})
