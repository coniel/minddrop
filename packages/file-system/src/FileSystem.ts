import * as Api from './FsApi';
import {
  IncrementedPath,
  incrementalPath as incrementalPathFn,
} from './incrementalPath';
import type { FileSystem, FileSystemAdapter } from './types';

let FsAdapter: FileSystemAdapter = {} as FileSystemAdapter;

export const Fs: FileSystem &
  typeof Api & { incrementalPath: typeof incrementalPath } = {
  ...Api,
  incrementalPath,
  setWorkspaceDirPath: (...args) => FsAdapter.setWorkspaceDirPath(...args),
  getBaseDirPath: (...args) => FsAdapter.getBaseDirPath(...args),
  convertFileSrc: (...args) => FsAdapter.convertFileSrc(...args),
  isDirectory: (...args) => FsAdapter.isDirectory(...args),
  copyFile: (...args) => FsAdapter.copyFile(...args),
  createDir: (...args) => FsAdapter.createDir(...args),
  exists: (...args) => FsAdapter.exists(...args),
  readBinaryFile: (...args) => FsAdapter.readBinaryFile(...args),
  readDir: (...args) => FsAdapter.readDir(...args),
  readTextFile: (...args) => FsAdapter.readTextFile(...args),
  removeDir: (...args) => FsAdapter.removeDir(...args),
  removeFile: (...args) => FsAdapter.removeFile(...args),
  trashDir: (...args) => FsAdapter.trashDir(...args),
  trashFile: (...args) => FsAdapter.trashFile(...args),
  rename: (...args) => FsAdapter.rename(...args),
  writeBinaryFile: (...args) => FsAdapter.writeBinaryFile(...args),
  writeTextFile: (...args) => FsAdapter.writeTextFile(...args),
  downloadFile: (...args) => FsAdapter.downloadFile(...args),
  readJsonFile: (...args) => FsAdapter.readJsonFile(...args),
  writeJsonFile: (...args) => FsAdapter.writeJsonFile(...args),
};

/**
 * Registers a file system adapter responsible for handling
 * file system operations on the OS file system.
 *
 * @param adapter - The file sytsem adapter.
 */
export const registerFileSystemAdapter = (adapter: FileSystemAdapter) =>
  (FsAdapter = adapter);

/**
 * Adds a numerix suffix to the given file path if the file
 * path already exists.
 *
 * @param targetPath - The path to check.
 * @returns The incremented path and increment number if incremeneted.
 */
async function incrementalPath(targetPath: string): Promise<IncrementedPath> {
  return incrementalPathFn(FsAdapter, targetPath);
}
