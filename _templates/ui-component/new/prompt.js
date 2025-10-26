const fs = require('fs');
const path = require('path');

const uiPackagesPath = path.resolve(__dirname, '../../../ui');
const uiPackages = fs.readdirSync(uiPackagesPath);

function getChoices(componentName) {
  const packagePrefix = componentName.replace(/([A-Z])/g, ' $1').trim().split(' ')[0].toLowerCase();
  const matchedPackage = uiPackages.find(pkg => pkg.startsWith(packagePrefix));
  const otherPackages = uiPackages.filter(pkg => [matchedPackage, 'primitives', 'ui-sandbox'].indexOf(pkg) === -1);

  return [matchedPackage, 'primitives', ...otherPackages].filter(package => package);
}

module.exports = {
  prompt: ({ prompter, args }) =>
    prompter
      .prompt({
        type: 'select',
        name: 'package',
        message: 'Where should we create this component?',
        choices: getChoices(args.name),
      })
      .then(({ package }) => {
        return Promise.resolve({
        location: package,
        });
      }),
};
