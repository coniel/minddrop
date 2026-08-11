import type { ElectrobunConfig } from 'electrobun';

export default {
  app: {
    name: 'MindDrop',
    identifier: 'desktop.minddrop.dev',
    version: '0.0.1',
  },
  build: {
    // Vite builds to dist/, we copy from there
    copy: {
      'dist/index.html': 'views/mainview/index.html',
      'dist/assets': 'views/mainview/assets',
      // Sharp's platform-specific native bindings. The bundled bun code
      // requires these at runtime, so they have to sit in a node_modules
      // dir the bundle can resolve from.
      '../../node_modules/@img': 'node_modules/@img',
    },
    bun: {
      entrypoint: 'src/bun/index.ts',
    },
    views: {
      mainview: {
        entrypoint: 'src/mainview/index.ts',
        sourcemap: 'linked',
      },
    },
    mac: {
      bundleCEF: false,
      icons: 'assets/icon/macos/icon.iconset',
    },
    linux: {
      bundleCEF: false,
      icon: 'assets/icon/linux/256x256.png',
    },
    win: {
      bundleCEF: false,
      icon: 'assets/icon/windows/icon.ico',
    },
  },
} satisfies ElectrobunConfig;
