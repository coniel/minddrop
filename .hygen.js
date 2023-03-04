function toKebabCase(string) {
  return string.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );
}

module.exports = {
  helpers: {
    toKebabCase: (string) => toKebabCase(string),
  },
};
