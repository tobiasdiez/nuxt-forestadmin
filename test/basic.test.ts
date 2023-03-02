import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    //dev: true,
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    server: true,
  })

  it('root returns agent status', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await $fetch('/_admin')
    expect(response).toStrictEqual({ error: null, message: 'Agent is running' })
  })

  it('root/forest returns agent status', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await $fetch('/_admin/forest')
    expect(response).toStrictEqual({ error: null, message: 'Agent is running' })
  })
})
