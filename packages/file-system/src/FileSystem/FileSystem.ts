import { YAML, restoreDates } from '@minddrop/utils';
import * as Api from '../FsApi';
import { awaitPendingOperations } from '../PendingOperationsStore';
import { addFileExtension } from '../addFileExtension';
import { FileSystemWatcherDebounceMs } from '../constants';
import {
  FileNotFoundError,
  InvalidPathError,
  PathConflictError,
} from '../errors';
import { FileSystemChangedEvent } from '../events';
import {
  IncrementedPath,
  incrementalPath as incrementalPathFn,
  setPathIncrement,
} from '../incrementalPath';
import { IoQueue } from '../ioQueue';
import { resolveAbsolutePath } from '../resolveAbsolutePath';
import { startFileSystemWatcher } from '../startFileSystemWatcher';
import { trackAdapterOperations } from '../trackAdapterOperations';
import {
  BaseDirectory,
  CopyFileOptions,
  DownlodFileOptions,
  FileSystem,
  FileSystemAdapter,
  FsOptions,
  FsWriteFileOptions,
  OpenFilePickerOptions,
} from '../types';
import { hashContents } from '../utils/hashContents';
import { recordWrittenContents, recordWrittenStats } from '../writeRegistry';

export type { IncrementedPath } from '../incrementalPath';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
const events = {
  Changed: FileSystemChangedEvent,
} as const;

// Values consumers of the file system read, such as tests timing the
// watcher.
const constants = {
  WatcherDebounceMs: FileSystemWatcherDebounceMs,
};

const errors = {
  FileNotFound: FileNotFoundError,
  InvalidPath: InvalidPathError,
  PathConflict: PathConflictError,
};

/**
 * Test-only helpers.
 */
const tests = {
  awaitAllOperations: awaitPendingOperations,
  cleanup: cleanupFileSystem,
};

let FsAdapter: FileSystemAdapter = {} as FileSystemAdapter;
// Restores the adapter to its initial state, when it supports that
let resetAdapter: VoidFunction | null = null;
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
    hasPendingWrite: typeof hasPendingWrite;
    hashContents: typeof hashContents;
    recordWrittenContents: typeof recordWrittenContents;
    registerAdapter: typeof registerFileSystemAdapter;
    startWatcher: typeof startFileSystemWatcher;
    constants: typeof constants;
    events: typeof events;
    errors: typeof errors;
    tests: typeof tests;
  } = {
  ...Api,
  constants,
  events,
  errors,
  tests,
  hashContents,
  recordWrittenContents,
  registerAdapter: (...args) => registerFileSystemAdapter(...args),
  startWatcher: (...args) => startFileSystemWatcher(...args),
  incrementalPath,
  ensureDir,
  setPathIncrement,
  openFilePicker,
  readJsonFile,
  writeJsonFile,
  readYamlFile,
  writeYamlFile,
  addFileExtension,
  hasPendingWrite,
  resolveBaseDirPath: (baseDir) => BaseDirPaths[baseDir],
  convertFileSrc: (...args) => FsAdapter.convertFileSrc(...args),
  isDirectory: (...args) => FsAdapter.isDirectory(...args),
  copyFile,
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
  writeBinaryFile,
  writeTextFile,
  writeTextFiles,
  downloadFile,
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
    BaseDirPaths[dir] = await FsAdapter.resolveBaseDirPath(dir);
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
  /**
   * Restores the adapter to its initial state. Invoked by the
   * test cleanup once pending operations have settled.
   */
  reset?: VoidFunction;
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

  // Track every operation so in-flight work can be awaited
  FsAdapter = trackAdapterOperations(FsAdapter);
  resetAdapter = options?.reset ?? null;

  setBaseDirPaths();
};

/**
 * Waits for pending operations to settle, then restores the adapter
 * to its initial state.
 *
 * **Intended for use in tests only!**
 *
 * @returns A promise which resolves once the adapter has been reset.
 */
async function cleanupFileSystem(): Promise<void> {
  await awaitPendingOperations();

  if (resetAdapter) {
    resetAdapter();
  }
}

/**
 * Writes a text file, recording its contents as the app's own write.
 *
 * @param path - The file path.
 * @param contents - The file contents.
 * @param options - Write file options.
 */
async function writeTextFile(
  path: string,
  contents: string,
  options?: FsWriteFileOptions,
): Promise<void> {
  // Record the file's contents as the app's own write
  recordContentsWrite(path, contents, options?.baseDir);

  // Write the file
  await FsAdapter.writeTextFile(path, contents, options);
}

/**
 * Writes multiple text files, recording their contents as the app's
 * own writes.
 *
 * @param entries - The files to write, each with a path and contents.
 * @param options - Write file options shared by all entries.
 */
async function writeTextFiles(
  entries: { path: string; contents: string }[],
  options?: FsWriteFileOptions,
): Promise<void> {
  // Record the files' contents as the app's own writes
  entries.forEach((entry) =>
    recordContentsWrite(entry.path, entry.contents, options?.baseDir),
  );

  // Write the files
  await FsAdapter.writeTextFiles(entries, options);
}

/**
 * Writes a binary file, recording its stats as the app's own write.
 *
 * @param path - The file path.
 * @param file - The file contents.
 * @param options - Write file options.
 */
async function writeBinaryFile(
  path: string,
  file: Blob,
  options?: FsWriteFileOptions,
): Promise<void> {
  // Write the file
  await FsAdapter.writeBinaryFile(path, file, options);

  // Record the file's stats as the app's own write
  await recordStatsWrite(path, options?.baseDir);
}

/**
 * Copies a file, recording the copy's stats as the app's own write.
 *
 * @param source - The path of the file to copy.
 * @param destination - The path to copy the file to.
 * @param options - Copy file options.
 */
async function copyFile(
  source: string,
  destination: string,
  options?: CopyFileOptions,
): Promise<void> {
  // Copy the file
  await FsAdapter.copyFile(source, destination, options);

  // Record the copy's stats as the app's own write
  await recordStatsWrite(destination, options?.toPathBaseDir);
}

/**
 * Downloads a file, recording its stats as the app's own write.
 *
 * @param url - The URL of the file to download.
 * @param path - The path to save the file to.
 * @param options - Download file options.
 */
async function downloadFile(
  url: string,
  path: string,
  options?: DownlodFileOptions,
): Promise<void> {
  // Download the file
  await FsAdapter.downloadFile(url, path, options);

  // Record the file's stats as the app's own write
  await recordStatsWrite(path, options?.baseDir);
}

/**
 * Records a written file's stats in the write registry, under the
 * file's absolute path.
 *
 * @param path - The path written to.
 * @param baseDir - The base directory written into, if any.
 */
async function recordStatsWrite(
  path: string,
  baseDir?: BaseDirectory,
): Promise<void> {
  // Resolve the absolute path to record the write under
  const recordedPath = resolveAbsolutePath(path, baseDir);

  // Check the path could be resolved. If not, the write cannot be
  // recorded.
  if (!recordedPath) {
    return;
  }

  // Record the file's stats
  recordWrittenStats(recordedPath, await FsAdapter.stat(recordedPath));
}

/**
 * Records written contents in the write registry, under the file's
 * absolute path.
 *
 * @param path - The path written to.
 * @param contents - The contents written.
 * @param baseDir - The base directory written into, if any.
 */
function recordContentsWrite(
  path: string,
  contents: string,
  baseDir?: BaseDirectory,
): void {
  // Resolve the absolute path to record the write under
  const recordedPath = resolveAbsolutePath(path, baseDir);

  // Check the path could be resolved. If not, the write cannot be
  // recorded.
  if (!recordedPath) {
    return;
  }

  // Record the contents
  recordWrittenContents(recordedPath, contents);
}

/**
 * Checks whether a write is queued for the given path but has not
 * been flushed to disk yet. Always false when the I/O queue is
 * skipped, as writes then go straight to the adapter.
 *
 * @param path - The file path.
 * @returns Whether a write is pending for the path.
 */
function hasPendingWrite(path: string): boolean {
  return ioQueue?.hasPendingWrite(path) ?? false;
}

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
 * Writes a JSON file, recording its contents as the app's own write.
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
  // Serialize the JSON
  const contents = JSON.stringify(jsonContent, null, pretty ? 2 : 0);

  // Write the file
  await writeTextFile(path, contents, options);
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
 * Writes a YAML file, recording its contents as the app's own write.
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
  // Serialize the values to YAML
  const text = YAML.stringify(values);

  // Write the file
  await writeTextFile(path, text, options);
}
