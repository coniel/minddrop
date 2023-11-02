import { fs } from '@tauri-apps/api';
import { appConfigDir, appDataDir, documentDir } from '@tauri-apps/api/path';
import {
  FsFileOptions,
  FsDirOptions,
  registerFileSystemAdapter,
  BaseDirectory,
  InvalidParameterError,
} from '@minddrop/core';
import '@minddrop/theme/src/reset.css';
import '@minddrop/theme/src/light.css';
import '@minddrop/theme/src/dark.css';
import '@minddrop/theme/src/base.css';
import '@minddrop/theme/src/animations.css';

function convertFsOptions(options: FsFileOptions | FsDirOptions): fs.FsOptions {
  const opts: fs.FsOptions = {};

  switch (options.dir) {
    case BaseDirectory.AppData:
      opts.dir = fs.BaseDirectory.AppData;
      break;
    case BaseDirectory.AppConfig:
      opts.dir = fs.BaseDirectory.AppConfig;
      break;
    case BaseDirectory.Documents:
      opts.dir = fs.BaseDirectory.Document;
      break;
  }

  if ('recursive' in options && typeof options.recursive === 'boolean') {
    (opts as FsDirOptions).recursive = options.recursive;
  }

  return opts;
}

function getDirPath(dir: BaseDirectory): Promise<string> {
  switch (dir) {
    case BaseDirectory.AppData:
      return appDataDir();
    case BaseDirectory.AppConfig:
      return appConfigDir();
    case BaseDirectory.Documents:
      return documentDir();
    default:
      throw new InvalidParameterError(`Invalid BaseDirectory value: ${dir}`);
  }
}

registerFileSystemAdapter({
  getDirPath,
  copyFile: async (source, destination, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.copyFile(source, destination, opts);
  },
  createDir: async (dir, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.createDir(dir, opts);
  },
  exists: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.exists(path, opts);
  },
  readBinaryFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readBinaryFile(path, opts);
  },
  readDir: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readDir(path, opts);
  },
  readTextFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readTextFile(path, opts);
  },
  removeDir: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.removeDir(path, opts);
  },
  removeFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.removeFile(path, opts);
  },
  renameFile: async (oldPath, newPath, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.renameFile(oldPath, newPath, opts);
  },
  writeBinaryFile: async (path, contents, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.writeBinaryFile(path, contents, opts);
  },
  writeTextFile: async (path, contents, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.writeTextFile(path, contents, opts);
  },
});

export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return children;
};
