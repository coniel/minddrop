const toKebabCase =
  require('@minddrop/utils/dist/toKebabCase/toKebabCase').toKebabCase;

module.exports = {
  helpers: {
    toKebabCase: (string) => toKebabCase(string),
  },
};
