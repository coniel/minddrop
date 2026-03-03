import type { ElectrobunConfig } from 'electrobun';

export default {
  app: {
    name: 'DevReview',
    identifier: 'dev-review.minddrop.dev',
    version: '0.0.1',
  },
  build: {
    copy: {
      'dist/index.html': 'views/mainview/index.html',
      'dist/assets': 'views/mainview/assets',
    },
    bun: {
      entrypoint: 'src/bun/index.ts',
    },
    views: {
      mainview: {
        entrypoint: 'src/renderer/index.ts',
        sourcemap: 'linked',
      },
    },
    mac: {
      bundleCEF: false,
    },
    linux: {
      bundleCEF: false,
    },
    win: {
      bundleCEF: false,
    },
  },
} satisfies ElectrobunConfig;
