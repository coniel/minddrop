const withPlugins = require('next-compose-plugins');
const withVideos = require('next-videos');
const withOptimizedImages = require('next-optimized-images');

const withTM = require('next-transpile-modules')([
  '@modulz/design-system',
  '@minddrop/icons',
  '@minddrop/theme',
  '@minddrop/icons',
]);

module.exports = withPlugins([withOptimizedImages, withVideos, withTM], {
  // Next.js config
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/docs/extensions',
        destination: '/docs/extensions/getting-started/introduction',
        permanent: false,
      },
      {
        source: '/docs/themes',
        destination: '/docs/themes/getting-started/installation',
        permanent: false,
      },
      {
        source: '/docs/api',
        destination: '/docs/api/getting-started/introduction',
        permanent: false,
      },
      {
        source: '/docs/ui',
        destination: '/docs/ui/overview/introduction',
        permanent: false,
      },
    ];
  },
});
