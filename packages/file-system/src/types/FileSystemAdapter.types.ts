import { BaseDirectory } from './BaseDirectory.types';
import { FileEntry } from './FileEntry.types';
import { FsDirOptions } from './FsDirOptions.types';
import { FsFileOptions } from './FsFileOptions.types';

export interface FileSystemAdapter {
  /**
   * Returns the path of a BaseDirectory.
   *
   * @param dir - The directory for which to retrieve the path.
   * @returns The directory path.
   */
  getDirPath(dir: BaseDirectory): Promise<string>;

  /**
   * Checks if a path is a directory.
   *
   * @param path - The path to check.
   * @param options - File system file options.
   * @returns A promise resolving to a boolean indicating whether or not the path is a directory.
   */
  isDirectory(path: string, options?: FsFileOptions): Promise<boolean>;

  /**
   * Copies a file to a destination.
   *
   * @param source - The source file's path.
   * @param destination - The path to which to copy the file.
   * @param options - File system file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  copyFile(
    source: string,
    destination: string,
    options?: FsFileOptions,
  ): Promise<void>;

  /**
   * Creates a directory. If one of the path's parent components doesn't
   * exist and the recursive option isn't set to true, the promise will
   * be rejected.
   *
   * @param dir - The directory path to create.
   * @param options - File system dir options.
   */
  createDir(dir: string, options?: FsDirOptions): Promise<void>;

  /**
   * Check if a path exists.
   *
   * @param path - The path to check.
   * @param options - File system file options.
   * @returns A promise resolving to a boolean indicating whether or not the path exists.
   */
  exists(path: string, options?: FsFileOptions): Promise<boolean>;

  /**
   * Reads a file as byte array.
   *
   * @param path - The file path.
   * @param options - File system file options.
   * @returns A promise resolving to the file contents.
   */
  readBinaryFile(path: string, options?: FsFileOptions): Promise<Uint8Array>;

  /**
   * List directory files.
   *
   * @param path - The directory path to read.
   * @param options - File system dir options.
   * @returns A promise resolving to an array of FileEntry objects.
   */
  readDir(path: string, options?: FsDirOptions): Promise<FileEntry[]>;

  /**
   * Reads a file as an UTF-8 encoded string.
   *
   * @param path - The file path.
   * @param options - File system file options.
   * @returns A promise resolving to the contents of the file.
   */
  readTextFile(path: string, options?: FsFileOptions): Promise<string>;

  /**
   * Removes a directory. If the directory is not empty and the recursive option
   * isn't set to true, the promise will be rejected.
   *
   * @param path - The directory path.
   * @param options - File system dir options.
   * @returns A promise indicating the success or failure of the operation.
   */
  removeDir(path: string, options?: FsDirOptions): Promise<void>;

  /**
   * Removes a file.
   *
   * @param path - The file path.
   * @param options - File system file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  removeFile(path: string, options?: FsFileOptions): Promise<void>;

  /**
   * Moves a dir to the OS Trash/Recycle Bin.
   *
   * @param path - The dir path.
   * @param options - File system file options.
   */
  trashDir(path: string, options?: FsFileOptions): Promise<void>;

  /**
   * Moves a file to the OS Trash/Recycle Bin.
   *
   * @param path - The file path.
   * @param options - File system file options.
   */
  trashFile(path: string, options?: FsFileOptions): Promise<void>;

  /**
   * Renames a file.
   *
   * @param oldPath - The old path.
   * @param newPath - The new path.
   * @param options - File system file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  renameFile(
    oldPath: string,
    newPath: string,
    options?: FsFileOptions,
  ): Promise<void>;

  /**
   * Writes a byte array content to a file.
   *
   * @param path - The file path.
   * @param contents - The file contents.
   * @param options - File system file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  writeBinaryFile(
    path: string,
    contents: Iterable<number> | ArrayLike<number> | ArrayBuffer,
    options?: FsFileOptions,
  ): Promise<void>;

  /**
   * Writes a UTF-8 text file.
   *
   * @param path - The file path.
   * @param contents - The file contents.
   * @param options - File system file options.
   * @returns A promise indicating the success or failure of the operation.
   */
  writeTextFile(
    path: string,
    contents: string,
    options?: FsFileOptions,
  ): Promise<void>;
}
