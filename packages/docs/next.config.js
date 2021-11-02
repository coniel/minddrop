const withPlugins = require('next-compose-plugins');
const withVideos = require('next-videos');
const withOptimizedImages = require('next-optimized-images');

const withTM = require('next-transpile-modules')(['@modulz/design-system']);

module.exports = withPlugins([withTM, withOptimizedImages, withVideos], {
  // Next.js config
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
