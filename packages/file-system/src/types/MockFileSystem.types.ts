import { FileEntry } from './FileEntry.types';
import { FileSystem } from './FileSystem.types';

export interface MockFileSystem {
  MockFs: FileSystem;
  clearMockFileSystem(): void;
  resetMockFileSystem(): void;
  clearTrash(): void;
  setFiles(files: MockFileDescriptor[]): void;
  addFiles(files: MockFileDescriptor[]): void;
  getFiles(): FileEntry[];
  getTrash(): FileEntry[];
  printFiles(): void;
  exists(path: string): boolean;
  readTextFile(path: string): string;
  writeTextFile(path: string, textContent: string): void;
}

export type MockFsRoot = Record<string, FileEntry>;

export type MockFileDescriptor = string | { path: string; textContent: string };
