import { YAML, restoreDates } from '@minddrop/utils';
import * as Api from './FsApi';
import { addFileExtension } from './addFileExtension';
import {
  IncrementedPath,
  incrementalPath as incrementalPathFn,
  setPathIncrement,
} from './incrementalPath';
import { IoQueue } from './ioQueue';
import {
  BaseDirectory,
  FileSystem,
  FileSystemAdapter,
  FsOptions,
  OpenFilePickerOptions,
} from './types';

export type { IncrementedPath } from './incrementalPath';

let FsAdapter: FileSystemAdapter = {} as FileSystemAdapter;
const BaseDirPaths: Record<BaseDirectory, string> = {
  [BaseDirectory.AppData]: '',
  [BaseDirectory.AppConfig]: '',
  [BaseDirectory.Documents]: '',
};

export const Fs: Omit<FileSystem, 'openFilePicker'> &
  typeof Api & {
    incrementalPath: typeof incrementalPath;
    ensureDir: typeof ensureDir;
    readJsonFile: typeof readJsonFile;
    writeJsonFile: typeof writeJsonFile;
    readYamlFile: typeof readYamlFile;
    writeYamlFile: typeof writeYamlFile;
    openFilePicker: typeof openFilePicker;
    setPathIncrement: typeof setPathIncrement;
    addFileExtension: typeof addFileExtension;
  } = {
  ...Api,
  incrementalPath,
  ensureDir,
  setPathIncrement,
  openFilePicker,
  readJsonFile,
  writeJsonFile,
  readYamlFile,
  writeYamlFile,
  addFileExtension,
  getBaseDirPath: (baseDir) => BaseDirPaths[baseDir],
  convertFileSrc: (...args) => FsAdapter.convertFileSrc(...args),
  isDirectory: (...args) => FsAdapter.isDirectory(...args),
  copyFile: (...args) => FsAdapter.copyFile(...args),
  createDir: (...args) => FsAdapter.createDir(...args),
  exists: (...args) => FsAdapter.exists(...args),
  readDir: (...args) => FsAdapter.readDir(...args),
  readTextFile: (...args) => FsAdapter.readTextFile(...args),
  readTextFiles: (...args) => FsAdapter.readTextFiles(...args),
  removeDir: (...args) => FsAdapter.removeDir(...args),
  removeFile: (...args) => FsAdapter.removeFile(...args),
  trashDir: (...args) => FsAdapter.trashDir(...args),
  trashFile: (...args) => FsAdapter.trashFile(...args),
  rename: (...args) => FsAdapter.rename(...args),
  writeBinaryFile: (...args) => FsAdapter.writeBinaryFile(...args),
  writeTextFile: (...args) => FsAdapter.writeTextFile(...args),
  writeTextFiles: (...args) => FsAdapter.writeTextFiles(...args),
  downloadFile: (...args) => FsAdapter.downloadFile(...args),
  watch: (...args) => FsAdapter.watch(...args),
  unwatch: (...args) => FsAdapter.unwatch(...args),
  stat: (...args) => FsAdapter.stat(...args),
};

async function setBaseDirPaths(): Promise<void> {
  [
    BaseDirectory.AppData,
    BaseDirectory.AppConfig,
    BaseDirectory.Documents,
  ].forEach(async (dir) => {
    BaseDirPaths[dir] = await FsAdapter.getBaseDirPath(dir);
  });
}

// The I/O queue instance, created when the adapter is registered
let ioQueue: IoQueue | null = null;

interface RegisterAdapterOptions {
  /**
   * Skip wrapping the adapter with the I/O queue. Used in
   * tests where the mock adapter is synchronous and the
   * queue's debounce delay would cause timeouts.
   */
  skipQueue?: boolean;
}

/**
 * Registers a file system adapter responsible for handling
 * file system operations on the OS file system. Text file
 * reads and writes are wrapped with an I/O queue that batches
 * concurrent operations into single adapter calls.
 *
 * @param adapter - The file system adapter.
 * @param options - Registration options.
 */
export const registerFileSystemAdapter = (
  adapter: FileSystemAdapter,
  options?: RegisterAdapterOptions,
) => {
  if (options?.skipQueue) {
    FsAdapter = adapter;
  } else {
    ioQueue = new IoQueue(adapter);

    FsAdapter = {
      ...adapter,
      readTextFile: (path, readOptions) => ioQueue!.read(path, readOptions),
      readTextFiles: (paths, readOptions) =>
        ioQueue!.readMany(paths, readOptions),
      writeTextFile: (path, contents, writeOptions) =>
        ioQueue!.write(path, contents, writeOptions),
      writeTextFiles: (entries, writeOptions) =>
        ioQueue!.writeMany(entries, writeOptions),
    };
  }

  setBaseDirPaths();
};

/**
 * Opens the syetem file picker.
 *
 * @param options - Open file picker options.
 * @returns A promise resolving to file path(s) or null if nothing was selected.
 */
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

/**
 * Ensures that a directory exists at the given path.
 * If the directory does not exist, it will be created
 * recursively.
 *
 * @param path - The directory path.
 */
async function ensureDir(path: string): Promise<void> {
  if (!(await Fs.exists(path))) {
    await Fs.createDir(path, { recursive: true });
  }
}

/**
 * Reads a JSON file and parses its contents.
 *
 * @param path - The file path.
 * @param options - Read file options and a boolean indicating whether to restore dates which default to true.
 * @returns A promise resolving to the parsed JSON data.
 */
async function readJsonFile<TData extends object = object>(
  path: string,
  options?: FsOptions & { restoreDates?: boolean },
): Promise<TData> {
  const content = await FsAdapter.readTextFile(path, options);

  let data = JSON.parse(content) as TData;

  if (options?.restoreDates !== false) {
    data = restoreDates(data);
  }

  return data;
}

/**
 * Writes a JSON file.
 *
 * @param path - The file path.
 * @param jsonContent - The JSON content to write.
 * @param pretty - Whether or not to pretty print the JSON, defaults to true.
 * @param options - Write file options.
 * @returns A promise indicating the success or failure of the operation.
 */
async function writeJsonFile(
  path: string,
  jsonContent: object,
  pretty?: boolean,
  options?: FsOptions,
): Promise<void> {
  const contents = JSON.stringify(jsonContent, null, pretty ? 2 : 0);

  await FsAdapter.writeTextFile(path, contents, options);
}

/**
 * Reads a YAML file and parses its contents.
 *
 * @param path - The file path.
 * @param options - Read file options and a boolean indicating whether to restore dates which default to true.
 * @returns A promise resolving to the parsed YAML data.
 */
async function readYamlFile<TData extends object = object>(
  path: string,
  options?: FsOptions & { restoreDates?: boolean },
): Promise<TData> {
  const content = await FsAdapter.readTextFile(path, options);

  let data = YAML.parse(content) as TData;

  if (options?.restoreDates !== false) {
    data = restoreDates(data);
  }

  return data;
}

/**
 * Writes a YAML file.
 *
 * @param path - The file path.
 * @param values - The data to serialize to YAML.
 * @param options - Write file options.
 * @returns A promise indicating the success or failure of the operation.
 */
async function writeYamlFile(
  path: string,
  values: Record<string, unknown>,
  options?: FsOptions,
): Promise<void> {
  const text = YAML.stringify(values);

  await FsAdapter.writeTextFile(path, text, options);
}
