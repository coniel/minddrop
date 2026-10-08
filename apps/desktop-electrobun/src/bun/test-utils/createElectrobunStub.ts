import path from 'node:path';

/**
 * The exports of the `electrobun/bun` stub module.
 */
export interface ElectrobunStub {
  Utils: {
    paths: {
      appData: string;
      config: string;
      documents: string;
    };
    moveToTrash: (path: string) => void;
  };
}

/**
 * Creates a stand-in for the `electrobun/bun` module. The real module
 * needs the native Electrobun libraries. The app data, config and
 * documents directories resolve to the `appdata`, `config` and
 * `documents` directories inside the base directory. Trashing does
 * nothing.
 *
 * @param baseDir - The directory with the stub's base directories.
 * @returns The stub module's exports.
 */
export function createElectrobunStub(baseDir: string): ElectrobunStub {
  return {
    Utils: {
      paths: {
        appData: path.join(baseDir, 'appdata'),
        config: path.join(baseDir, 'config'),
        documents: path.join(baseDir, 'documents'),
      },
      moveToTrash: () => undefined,
    },
  };
}
