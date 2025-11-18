/* eslint-disable @typescript-eslint/no-explicit-any */
import { FsEntry } from './FileEntry.types';
import { FileSystem } from './FileSystem.types';
import {
  FsCreateDirOptions,
  FsExistsOptions,
  FsFileOptions,
  FsReadFileOptions,
  FsRemoveDirOptions,
  FsRemoveFileOptions,
  FsWriteFileOptions,
} from './FsOptions.types';

export interface MockFileSystem {
  MockFs: FileSystem;
  clear(): void;
  reset(): void;
  clearTrash(): void;
  setFiles(files: (MockFileDescriptor | string)[]): void;
  addFiles(files: (MockFileDescriptor | string)[]): void;
  getFiles(): FsEntry[];
  getTrash(): FsEntry[];
  printFiles(): void;
  printTree(): void;
  exists(path: string, options?: FsExistsOptions): boolean;
  existsInTrash(path: string, options?: FsExistsOptions): boolean;
  readTextFile(path: string, options?: FsReadFileOptions): string;
  readJsonFile<TType = object>(
    path: string,
    options?: FsReadFileOptions,
  ): TType;
  readYamlFile<TData extends object = object>(
    path: string,
    options?: FsReadFileOptions,
  ): Promise<TData>;
  writeTextFile(
    path: string,
    textContent: string,
    options?: FsWriteFileOptions,
  ): void;
  writeJsonFile(
    path: string,
    jsonContent: object,
    pretty?: boolean,
    options?: FsWriteFileOptions,
  ): void;
  writeYamlFile(
    path: string,
    values: Record<string, unknown>,
    options?: FsWriteFileOptions,
  ): Promise<void>;
  createDir(path: string, options?: FsCreateDirOptions): void;
  removeFile(path: string, options?: FsRemoveFileOptions): void;
  removeDir(path: string, options?: FsRemoveDirOptions): void;
  downloadFile(url: string, path: string, options?: FsFileOptions): void;
}

export type MockFsRoot = Record<string, FsEntry>;

export type MockFileDescriptor = {
  path: string;
  textContent?: string;
  binaryFile?: any;
  options?: FsFileOptions;
};
