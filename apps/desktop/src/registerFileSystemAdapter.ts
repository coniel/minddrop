import {
  copyFile,
  exists,
  readFile,
  readTextFile,
  readDir,
  writeFile,
  writeTextFile,
  rename,
  remove,
  mkdir,
  DirEntry,
  CopyFileOptions,
  RenameOptions,
} from '@tauri-apps/plugin-fs';
import {
  BaseDirectory,
  appConfigDir,
  appDataDir,
  documentDir,
} from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/core';
import { WorkspaceConfigDirName } from '@minddrop/workspaces';

interface BaseDirOptions {
  baseDir?: BaseDirectory;
}

import {
  registerFileSystemAdapter as register,
  BaseDirectory as FsBaseDirectory,
  FsEntry,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';

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
  return !entry.name.startsWith('.') || entry.name === WorkspaceConfigDirName;
}

register({
  getBaseDirPath,
  isDirectory: async (path, fsOptions = {}) => {
    const options = translateBaseDir(fsOptions);

    try {
      await readDir(path, options);

      return true;
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
});
