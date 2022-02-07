module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../../../packages/ui/**/*.stories.@(ts|tsx)',
    '../../../packages/app-ui/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode',
  ],
};
