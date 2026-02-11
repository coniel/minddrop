import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import {
  BaseDirectory,
  appConfigDir,
  appDataDir,
  documentDir,
} from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import {
  CopyFileOptions,
  DirEntry,
  RenameOptions,
  copyFile,
  exists,
  mkdir,
  readDir,
  readFile,
  readTextFile,
  remove,
  rename,
  writeFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs';
import { download } from '@tauri-apps/plugin-upload';
import {
  BaseDirectory as FsBaseDirectory,
  FsEntry,
  registerFileSystemAdapter as register,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';

interface BaseDirOptions {
  baseDir?: BaseDirectory;
}

function getBaseDirPath(dir: FsBaseDirectory): Promise<string> {
  switch (dir) {
    case FsBaseDirectory.AppData:
      return appDataDir();
    case FsBaseDirectory.AppConfig:
      return appConfigDir();
    case FsBaseDirectory.Documents:
      return documentDir();
    default:
      throw new InvalidParameterError(`Invalid BaseDirectory value: ${dir}`);
  }
}

function getBaseDir(dir: FsBaseDirectory): BaseDirectory {
  switch (dir) {
    case FsBaseDirectory.AppData:
      return BaseDirectory.AppData;
    case FsBaseDirectory.AppConfig:
      return BaseDirectory.AppConfig;
    case FsBaseDirectory.Documents:
      return BaseDirectory.Document;
    default:
      throw new InvalidParameterError(`Invalid BaseDirectory value: ${dir}`);
  }
}

function translateBaseDir(
  fsOptions: {
    baseDir?: FsBaseDirectory;
  } = {},
): BaseDirOptions {
  const options: BaseDirOptions = {};

  if (fsOptions.baseDir) {
    options.baseDir = getBaseDir(fsOptions.baseDir);
  }

  return options;
}

async function dirEntryToFsEntry(
  entry: DirEntry,
  recursive = false,
  depth = 0,
): Promise<FsEntry> {
  const fsEntry: FsEntry = {
    name: entry.name.split('/').pop(),
    path: entry.name,
  };

  if (entry.isDirectory && (depth === 0 || recursive)) {
    fsEntry.children = await Promise.all(
      await readDir(entry.name).then((entries) =>
        entries
          .filter(isNonHiddenFileOrWorkspaceConfig)
          .map((childEntry) =>
            dirEntryToFsEntry(
              { ...childEntry, name: `${entry.name}/${childEntry.name}` },
              recursive,
              depth,
            ),
          ),
      ),
    );
  }

  return fsEntry;
}

function isNonHiddenFileOrWorkspaceConfig(entry: DirEntry): boolean {
  return !entry.name.startsWith('.') || entry.name === '.minddrop';
}

register({
  getBaseDirPath,
  convertFileSrc: (path) => convertFileSrc(path),
  isDirectory: async (path, fsOptions = {}) => {
    const options = translateBaseDir(fsOptions);

    try {
      await readDir(path, options);

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  },
  copyFile: async (source, destination, fsOptions = {}) => {
    const options: CopyFileOptions = {};

    if (fsOptions.fromPathBaseDir) {
      options.fromPathBaseDir = getBaseDir(fsOptions.fromPathBaseDir);
    }

    if (fsOptions.toPathBaseDir) {
      options.toPathBaseDir = getBaseDir(fsOptions.toPathBaseDir);
    }

    return copyFile(source, destination);
  },
  createDir: async (dir, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    mkdir(dir, options);
  },
  exists: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return exists(path, options);
  },
  readBinaryFile: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return readFile(path, options);
  },
  readDir: async (path, fsOptions = {}) => {
    const options = translateBaseDir(fsOptions);
    const dirs = await readDir(path, options);

    return await Promise.all(
      dirs
        .filter(isNonHiddenFileOrWorkspaceConfig)
        .map((dir) =>
          dirEntryToFsEntry(
            { ...dir, name: `${path}/${dir.name}` },
            fsOptions.recursive,
          ),
        ),
    );
  },
  readTextFile: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return readTextFile(path, options);
  },
  readJsonFile: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    const content = await readTextFile(path, options);

    return JSON.parse(content);
  },
  removeDir: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return remove(path, options);
  },
  removeFile: async (path, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return remove(path, options);
  },
  trashDir: async (path) => {
    invoke('move_to_trash', { path }).catch((reason) => {
      throw new Error(reason);
    });
  },
  trashFile: async (path) => {
    invoke('move_to_trash', { path }).catch((reason) => {
      throw new Error(reason);
    });
  },
  rename: async (oldPath, newPath, fsOptions = {}) => {
    const options: RenameOptions = {};

    if (fsOptions.oldPathBaseDir) {
      options.oldPathBaseDir = getBaseDir(fsOptions.oldPathBaseDir);
    }

    if (fsOptions.newPathBaseDir) {
      options.newPathBaseDir = getBaseDir(fsOptions.newPathBaseDir);
    }

    return rename(oldPath, newPath, options);
  },
  writeBinaryFile: async (path, file, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    file.arrayBuffer().then((buff) => {
      writeFile(path, new Uint8Array(buff), options);
    });
  },
  writeTextFile: async (path, contents, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    return writeTextFile(path, contents, options);
  },
  writeJsonFile: async (path, json, pretty, fsOptions) => {
    const options = translateBaseDir(fsOptions);

    const contents = JSON.stringify(json, null, pretty ? 2 : 0);

    return writeTextFile(path, contents, options);
  },
  downloadFile: async (url, path, options = {}) => {
    const fullPath = options.baseDir
      ? `${await getBaseDirPath(options.baseDir)}/${path}`
      : path;

    download(url, fullPath);
  },
  openFilePicker: async (options = {}) => {
    const result = await open({
      multiple: options?.multiple,
      directory: options?.directory,
      filters: options.accept
        ? [
            {
              name: 'Files',
              extensions: options?.accept,
            },
          ]
        : undefined,
    });

    return result;
  },
});
