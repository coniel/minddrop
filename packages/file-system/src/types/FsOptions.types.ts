import { BaseDirectory } from './BaseDirectory.types';

export interface FsOptions {
  baseDir?: BaseDirectory;
}

export interface FsRenameOptions {
  /**
   * Base directory for `oldPath`.
   */
  oldPathBaseDir?: BaseDirectory;

  /**
   * Base directory for `newPath`.
   */
  newPathBaseDir?: BaseDirectory;
}

export type FsExistsOptions = FsOptions;

export interface FsDirOptions extends FsOptions {
  recursive?: boolean;
}

export type FsReadDirOptions = FsDirOptions;
export type FsCreateDirOptions = FsDirOptions;
export type FsRemoveDirOptions = FsDirOptions;

export type FsFileOptions = FsOptions;

export type FsCreateFileOptions = FsFileOptions;
export type FsReadFileOptions = FsFileOptions;
export type FsWriteFileOptions = FsFileOptions;
export type FsRemoveFileOptions = FsFileOptions;
export type DownlodFileOptions = FsFileOptions;

export interface CopyFileOptions {
  /**
   * Base directory for `fromPath`.
   */
  fromPathBaseDir?: BaseDirectory;

  /**
   * Base directory for `toPath`.
   */
  toPathBaseDir?: BaseDirectory;
}

export interface OpenFilePickerOptions {
  /**
   * Whether to allow selecting a directory.
   */
  directory?: boolean;

  /**
   * Whether to allow selecting multiple files.
   */
  multiple?: boolean;

  /**
   * Files types to allow selecting.
   */
  accept?: string[];
}
