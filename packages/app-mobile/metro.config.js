const exclusionList = require('metro-config/src/defaults/exclusionList');
const { getMetroConfig } = require('react-native-monorepo-tools');

const yarnWorkspacesMetroConfig = getMetroConfig();

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // Add additional Yarn workspace package roots to the module map.
  // This allows importing importing from all the project's packages.
  watchFolders: yarnWorkspacesMetroConfig.watchFolders,
  resolver: {
    // Ensure we resolve nohoist libraries from this directory.
    blockList: exclusionList(yarnWorkspacesMetroConfig.blockList),
    extraNodeModules: yarnWorkspacesMetroConfig.extraNodeModules,
  },
};
