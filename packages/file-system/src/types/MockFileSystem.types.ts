import { FileEntry } from './FileEntry.types';
import { FileSystem } from './FileSystem.types';
import { FsDirOptions } from './FsDirOptions.types';
import { FsFileOptions } from './FsFileOptions.types';

export interface MockFileSystem {
  MockFs: FileSystem;
  clear(): void;
  reset(): void;
  clearTrash(): void;
  setFiles(files: (MockFileDescriptor | string)[]): void;
  addFiles(files: (MockFileDescriptor | string)[]): void;
  getFiles(): FileEntry[];
  getTrash(): FileEntry[];
  printFiles(): void;
  exists(path: string, options?: FsFileOptions | FsDirOptions): boolean;
  existsInTrash(path: string, options?: FsFileOptions | FsDirOptions): boolean;
  readTextFile(path: string, options?: FsFileOptions | FsDirOptions): string;
  writeTextFile(
    path: string,
    textContent: string,
    options?: FsFileOptions | FsDirOptions,
  ): void;
  removeFile(path: string, options?: FsFileOptions | FsDirOptions): void;
  removeDir(path: string, options?: FsFileOptions | FsDirOptions): void;
}

export type MockFsRoot = Record<string, FileEntry>;

export type MockFileDescriptor = {
  path: string;
  textContent?: string;
  options?: FsFileOptions | FsDirOptions;
};
