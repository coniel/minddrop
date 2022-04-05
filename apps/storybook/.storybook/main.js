module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../../../packages/ui/**/*.stories.@(ts|tsx)',
    '../../../packages/app-ui/**/*.stories.@(ts|tsx)',
    '../../../packages/minddrop/**/*.stories.@(ts|tsx)',
    '../../../packages/rich-text-editor/**/*.stories.@(ts|tsx)',
    '../../../extensions/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode',
  ],
};
