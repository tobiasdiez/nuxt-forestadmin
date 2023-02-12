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

## Usage

1. Add the module in `nuxt.config.ts`:

   ```ts
   export default defineNuxtConfig({
      modules: [
         'nuxt-forestadmin'
      ],
      forestadmin: {
         // Optional: config
      }
   })
   ̀ ``

   ```

2. TODO

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
