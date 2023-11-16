import { fs } from '@tauri-apps/api';
import { appConfigDir, appDataDir, documentDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import {
  FsFileOptions,
  FsDirOptions,
  registerFileSystemAdapter as register,
  BaseDirectory,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';

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

register({
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
  trashDir: async (path, opts) => {
    invoke('move_to_trash', { path }).catch((reason) => {
      throw new Error(reason);
    });
  },
  trashFile: async (path, opts) => {
    invoke('move_to_trash', { path }).catch((reason) => {
      throw new Error(reason);
    });
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
