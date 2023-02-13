# Nuxt module for Forest Admin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

This package allows you to easily integrate [Forest Admin](https://www.forestadmin.com/) in your [Nuxt 3](v3.nuxtjs.org) application.

## Features

- TODO

## Installation

```sh
# npm
npm install nuxt-forestadmin

# yarn
yarn add nuxt-forestadmin

# pnpm
pnpm add nuxt-forestadmin
```

You also need to install at least one of the [Forest Admin data source packages](https://docs.forestadmin.com/developer-guide-agents-nodejs/data-sources/connection).

## Usage

1. Add the module in `nuxt.config.ts` and specify the datasource:

   ```ts
   // Replace with a different datasource if needed
   import { createSqlDataSource } from '@forestadmin/datasource-sql'
   export default defineNuxtConfig({
      modules: [
         'nuxt-forestadmin'
      ],
      forestadmin: {
         dataSource: {
            factory: createSqlDataSource("<DATABASE URL>")
         }
      }
   })
   ̀ ``

2. Specify the [authSecret](https://docs.forestadmin.com/developer-guide-agents-nodejs/getting-started/install/create-your-agent#authsecret-string-no-default) and [envSecret](https://docs.forestadmin.com/developer-guide-agents-nodejs/getting-started/install/create-your-agent#envsecret-string-no-default) that you obtained during the onboarding procedure. You have two options to set them:

   - Via the [Runtime Config](https://nuxt.com/docs/guide/going-further/runtime-config#runtime-config) inside `nuxt.config.ts`:
      
      ```ts
      runtimeConfig: {
         forestadmin: {
            authSecret: "...",
            envSecret: "..."
         }
      }
      ̀ ``

      These can then be overwritten by the environment variables `NUXT_FORESTADMIN_AUTHSECRET` and `NUXT_FORESTADMIN_ENVSECRET` at runtime.
   - Via the `forestadmin` key inside the `nuxt.config.ts` at build-time: 
      
      ```ts
      forestadmin: {
         authSecret: "...",
         envSecret: "..."
      }
      ```

3. TODO

3. That's it! You can now use Forest Admin in your Nuxt app ✨

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10).
- Install dependencies using `pnpm install`.
- - Run `pnpm run prepare` to generate type stubs.
- Use `pnpm run dev` to start [playground](./playground) in development mode.

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-forestadmin?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/nuxt-forestadmin
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-forestadmin?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-forestadmin
[github-actions-src]: https://img.shields.io/github/workflow/status/tobiasdiez/nuxt-forestadmin/ci/main?style=flat-square
[github-actions-href]: https://github.com/tobiasdiez/nuxt-forestadmin/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/tobiasdiez/nuxt-forestadmin/main?style=flat-square
[codecov-href]: https://codecov.io/gh/tobiasdiez/nuxt-forestadmin
