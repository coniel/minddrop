const toKebabCase =
  require('@minddrop/utils/dist/toKebabCase/toKebabCase').toKebabCase;

console.log(toKebabCase);
module.exports = {
  helpers: {
    toKebabCase: (string) => toKebabCase(string),
  },
};
