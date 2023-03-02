import { createAgent } from '@forestadmin/agent'
import Router from '@koa/router'
import Koa from 'koa'
import { useLogger } from '@nuxt/kit'
import { defineEventHandler, sendError, defineLazyEventHandler } from 'h3'
import type { ForestAdminDataSource, Options } from '../module'
import _datasource from '#forestadmin/datasource'

const datasource = _datasource as ForestAdminDataSource
type KoaHandler = ReturnType<Koa['callback']>

const logger = useLogger('forestadmin')
async function startForestAdminServer(options: Options) {
  // Create your Forest Admin agent
  const agent = createAgent({
    ...options,
    isProduction: !options.isDev,
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
  })
  agent.addDataSource(datasource.factory, datasource.options)

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

export default defineLazyEventHandler(async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const options = useRuntimeConfig().forestAdmin as Options
  try {
    return await startForestAdminServer(options)
  } catch (error) {
    logger.error(error)
    return defineEventHandler((event) => {
      sendError(event, error as Error, options.isDev)
    })
  }
})
