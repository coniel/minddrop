/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@minddrop/ui',
  '@minddrop/theme',
]);

module.exports = {
  reactStrictMode: true,
};
