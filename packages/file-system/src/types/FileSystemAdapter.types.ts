import { BaseDirectory } from './BaseDirectory.types';
import { FsEntry } from './FileEntry.types';
import {
  CopyFileOptions,
  DownlodFileOptions,
  FsCreateDirOptions,
  FsExistsOptions,
  FsReadDirOptions,
  FsReadFileOptions,
  FsRemoveDirOptions,
  FsRemoveFileOptions,
  FsRenameOptions,
  FsWatchOptions,
  FsWriteFileOptions,
  OpenFilePickerOptions,
} from './FsOptions.types';

export type FsWatchEventKind = 'any' | 'create' | 'modify' | 'remove';

export interface FsWatchEvent {
  /**
   * The kind of event that occurred.
   */
  kind: FsWatchEventKind;

  /**
   * The paths affected by the event.
   */
  paths: string[];
}

export interface FileSystemAdapter {
  /**
   * Returns the path of a BaseDirectory.
   *
   * @param dir - The directory for which to retrieve the path.
   * @returns The directory path.
   */
  getBaseDirPath(dir: BaseDirectory): Promise<string>;

  /**
   * Converts a file path to a URL that can be loaded into the app webview
   * as a src attribute.
   *
   * @param path - The file path.
   * @returns A URL to the file.
   */
  convertFileSrc(path: string): string;

  /**
   * Checks if a path is a directory.
   *
   * @param path - The path to check.
   * @param options - Read directory options.
   * @returns A promise resolving to a boolean indicating whether or not the path is a directory.
   */
  isDirectory(path: string, options?: FsReadDirOptions): Promise<boolean>;

  /**
   * Copies a file to a destination.
   *
   * @param source - The source file's path.
   * @param destination - The path to which to copy the file.
   * @param options - Copy file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  copyFile(
    source: string,
    destination: string,
    options?: CopyFileOptions,
  ): Promise<void>;

  /**
   * Creates a directory.
   *
   * @param dir - The directory path to create.
   * @param options - Create directory options.
   */
  createDir(dir: string, options?: FsCreateDirOptions): Promise<void>;

  /**
   * Check if a path exists.
   *
   * @param path - The path to check.
   * @param options - Exists options.
   * @returns A promise resolving to a boolean indicating whether or not the path exists.
   */
  exists(path: string, options?: FsExistsOptions): Promise<boolean>;

  /**
   * List directory files.
   *
   * @param path - The directory path to read.
   * @param options - Read directory options.
   * @returns A promise resolving to an array of FileEntry objects.
   */
  readDir(path: string, options?: FsReadDirOptions): Promise<FsEntry[]>;

  /**
   * Reads a file as an UTF-8 encoded string.
   *
   * @param path - The file path.
   * @param options - Read file options.
   * @returns A promise resolving to the contents of the file.
   */
  readTextFile(path: string, options?: FsReadFileOptions): Promise<string>;

  /**
   * Removes a directory.
   *
   * @param path - The directory path.
   * @param options - Remove directory options.
   * @returns A promise indicating the success or failure of the operation.
   */
  removeDir(path: string, options?: FsRemoveDirOptions): Promise<void>;

  /**
   * Removes a file.
   *
   * @param path - The file path.
   * @param options - Remove file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  removeFile(path: string, options?: FsRemoveFileOptions): Promise<void>;

  /**
   * Moves a dir to the OS Trash/Recycle Bin.
   *
   * @param path - The dir path.
   */
  trashDir(path: string): Promise<void>;

  /**
   * Moves a file to the OS Trash/Recycle Bin.
   *
   * @param path - The file path.
   */
  trashFile(path: string): Promise<void>;

  /**
   * Renames a file.
   *
   * @param oldPath - The old path.
   * @param newPath - The new path.
   * @param options - Rename options.
   * @returns A promise indicating the success or failure of the operation.
   */
  rename(
    oldPath: string,
    newPath: string,
    options?: FsRenameOptions,
  ): Promise<void>;

  /**
   * Writes a byte array content to a file.
   *
   * @param path - The file path.
   * @param file - The file content.
   * @returns A promise indicating the success or failure of the operation.
   */
  writeBinaryFile(
    path: string,
    file: Blob,
    options?: FsWriteFileOptions,
  ): Promise<void>;

  /**
   * Writes a UTF-8 text file.
   *
   * @param path - The file path.
   * @param contents - The file contents.
   * @returns A promise indicating the success or failure of the operation.
   */
  writeTextFile(
    path: string,
    contents: string,
    options?: FsWriteFileOptions,
  ): Promise<void>;

  /**
   * Downloads a file from a URL to the given path.
   *
   * @param url - The URL to download the file from.
   * @param path - The path to save the file to.
   * @param options - Download file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  downloadFile(
    url: string,
    path: string,
    options?: DownlodFileOptions,
  ): Promise<void>;

  /**
   * Opens a file picker.
   *
   * @param options - Open file picker options.
   * @returns A promise resolving to an array of selected file paths.
   */
  openFilePicker(
    options?: OpenFilePickerOptions,
  ): Promise<string | string[] | null>;

  /**
   * Watches a file or directory for changes.
   *
   * @param paths - The paths to watch.
   * @param callback - The callback to invoke when a change occurs.
   * @param options - Watch options.
   * @returns A promise resolving to the watcher ID.
   */
  watch(
    paths: string[],
    callback: (event: FsWatchEvent) => void,
    options?: FsWatchOptions,
  ): Promise<string>;

  /**
   * Stops watching the paths associated with the given watcher ID.
   *
   * @param id - The watcher ID returned by `watch`.
   */
  unwatch(id: string): Promise<void>;
}
