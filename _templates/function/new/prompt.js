const fs = require('fs');
const path = require('path');

const packagesPath = path.resolve(__dirname, '../../../packages');
const extensionsPath = path.resolve(__dirname, '../../../extensions');
const packagesContent = fs.readdirSync(packagesPath);
const packages = packagesContent.filter((file) =>
  fs.statSync(path.resolve(packagesPath, file)).isDirectory(),
);
const extensions = fs.readdirSync(extensionsPath);
const choices = [
  ...packages.filter(
    (package) => !['app-desktop', 'docs', 'storybook'].includes(package),
  ),
  ...extensions,
];

module.exports = {
  prompt: ({ prompter }) =>
    prompter
      .prompt({
        type: 'select',
        name: 'package',
        message: 'Where should we create this function?',
        choices: choices,
      })
      .then(({ package }) => {
        const isExtension = fs.existsSync(`${extensionsPath}/${package}`);

        return Promise.resolve({
          package,
          location: isExtension ? 'extensions' : 'packages',
        });
      }),
};
