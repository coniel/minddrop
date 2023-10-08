/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../../../packages/ui/**/*.stories.@(ts|tsx)',
    '../../../packages/rich-text-editor/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
