const fs = require('fs');
const path = require('path');

const packagesPath = path.resolve(__dirname, '../../../packages');
const contents = fs.readdirSync(packagesPath);
const packages = contents.filter((file) =>
  fs.statSync(path.resolve(packagesPath, file)).isDirectory(),
);
const choices = packages.filter(
  (package) => !['app-desktop', 'docs', 'storybook'].includes(package),
);

module.exports = [
  {
    type: 'select',
    name: 'package',
    message: 'Select a package.',
    choices,
  },
];
