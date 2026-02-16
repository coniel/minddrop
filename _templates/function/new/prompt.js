const fs = require('fs');
const path = require('path');

const packagesPath = path.resolve(__dirname, '../../../packages');
const extensionsPath = path.resolve(__dirname, '../../../extensions');
const featuresPath = path.resolve(__dirname, '../../../features');
const packagesContent = fs.readdirSync(packagesPath);
const packages = packagesContent.filter((file) =>
  fs.statSync(path.resolve(packagesPath, file)).isDirectory(),
);
const extensions = fs.readdirSync(extensionsPath);
const features = fs.readdirSync(featuresPath);
const featuresChoices = features.map((feature) => (`features/${feature}`));
const extensionsChoices = extensions.map((extension) => (`extensions/${extension}`));
const choices = [
  ...packages,
  ...featuresChoices,
  ...extensionsChoices,
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
        let location = 'packages';
        const packageName = package.split('/').pop();

        if (package.startsWith('features/')) {
          location = 'features';
        } else if (package.startsWith('extensions/')) {
          location = 'extensions';
        }

        return Promise.resolve({
          package: packageName,
          location,
        });
      }),
};
