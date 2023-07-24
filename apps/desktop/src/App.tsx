import { DesktopApp } from '@minddrop/desktop-app';
import { fs } from '@tauri-apps/api';
import {
  FsFileOptions,
  FsDirOptions,
  registerFileSystemAdapter,
} from '@minddrop/core';

function convertFsOptions(options: FsFileOptions | FsDirOptions): fs.FsOptions {
  const opts: fs.FsOptions = {};

  if (options.dir === 'app-data') {
    opts.dir = fs.BaseDirectory.AppData;
  }

  if (options.dir === 'app-config') {
    opts.dir = fs.BaseDirectory.AppConfig;
  }

  if ('recursive' in options && typeof options.recursive === 'boolean') {
    (opts as FsDirOptions).recursive = options.recursive;
  }

  return opts;
}

registerFileSystemAdapter({
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
    console.log(options);
    const opts = options ? convertFsOptions(options) : undefined;
    console.log(opts);

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

function App() {
  return <DesktopApp />;
}

export default App;
