import { YAML } from '@minddrop/utils';
import * as Api from './FsApi';
import {
  IncrementedPath,
  incrementalPath as incrementalPathFn,
} from './incrementalPath';
import type {
  FileSystem,
  FileSystemAdapter,
  FsOptions,
  OpenFilePickerOptions,
} from './types';

let FsAdapter: FileSystemAdapter = {} as FileSystemAdapter;

export const Fs: Omit<FileSystem, 'openFilePicker'> &
  typeof Api & {
    incrementalPath: typeof incrementalPath;
    readYamlFile: typeof readYamlFile;
    writeYamlFile: typeof writeYamlFile;
    openFilePicker: typeof openFilePicker;
  } = {
  ...Api,
  incrementalPath,
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
  readYamlFile: (...args) => readYamlFile(...args),
  writeYamlFile: (...args) => writeYamlFile(...args),
  openFilePicker,
};

function openFilePicker(
  options: OpenFilePickerOptions & { multiple: true },
): Promise<string[] | null>;
function openFilePicker(
  options?: OpenFilePickerOptions & { multiple?: false },
): Promise<string | null>;
function openFilePicker(
  options?: OpenFilePickerOptions,
): Promise<string | string[] | null> {
  return FsAdapter.openFilePicker(options);
}

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
 * @param ignoreFileExtension - Whether to ignore the file extension when looking for existing files.
 * @returns The incremented path and increment number if incremeneted.
 */
async function incrementalPath(
  targetPath: string,
  ignoreFileExtension = false,
): Promise<IncrementedPath> {
  return incrementalPathFn(FsAdapter, targetPath, ignoreFileExtension);
}

async function readYamlFile<TData extends object = object>(
  path: string,
  options?: FsOptions,
): Promise<TData> {
  const test = await FsAdapter.readTextFile(path, options);

  return YAML.parse(test) as TData;
}

async function writeYamlFile(
  path: string,
  values: Record<string, unknown>,
  options?: FsOptions,
): Promise<void> {
  const text = YAML.stringify(values);

  await FsAdapter.writeTextFile(path, text, options);
}
