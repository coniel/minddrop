const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../../ui/**/*.stories.mdx', '../../ui/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-react-i18next',
    'storybook-dark-mode',
  ],
};
