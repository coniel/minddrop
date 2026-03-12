import { registerFileSystemAdapter } from '@minddrop/file-system';
import type { FileSystemAdapter } from '@minddrop/file-system';
import { fileSystemRpcHandlers } from '../fileSystemRpc';

const fs = fileSystemRpcHandlers;

/**
 * Registers a file system adapter backed by the existing
 * Bun-side file system RPC handlers. Bridges the adapter
 * interface (positional args) to the RPC handler interface
 * (named params).
 */
export function registerBunFileSystemAdapter(): void {
  registerFileSystemAdapter({
    getBaseDirPath: (dir) => fs.fsGetBaseDirPath({ dir }),
    readTextFile: (path, options) =>
      fs.fsReadTextFile({ path, baseDir: options?.baseDir }),
    writeTextFile: (path, contents, options) =>
      fs.fsWriteTextFile({ path, contents, baseDir: options?.baseDir }),
    createDir: (path, options) =>
      fs.fsCreateDir({
        path,
        baseDir: options?.baseDir,
        recursive: options?.recursive,
      }),
    removeFile: (path, options) =>
      fs.fsRemoveFile({ path, baseDir: options?.baseDir }),
    exists: (path, options) => fs.fsExists({ path, baseDir: options?.baseDir }),
    isDirectory: (path, options) =>
      fs.fsIsDirectory({ path, baseDir: options?.baseDir }),
    readDir: (path, options) =>
      fs.fsReadDir({
        path,
        baseDir: options?.baseDir,
        recursive: options?.recursive,
      }),
    rename: (oldPath, newPath, options) =>
      fs.fsRename({
        oldPath,
        newPath,
        oldPathBaseDir: options?.oldPathBaseDir,
        newPathBaseDir: options?.newPathBaseDir,
      }),
    convertFileSrc: (filePath) => filePath,
    stat: (path) => fs.fsStat({ path }),
    // Stub out methods not needed on the Bun side for search
    copyFile: async () => {},
    removeDir: async () => {},
    trashDir: async () => {},
    trashFile: async () => {},
    writeBinaryFile: async () => {},
    downloadFile: async () => {},
    openFilePicker: async () => null,
    watch: async () => '',
    unwatch: async () => {},
  } as FileSystemAdapter);
}
