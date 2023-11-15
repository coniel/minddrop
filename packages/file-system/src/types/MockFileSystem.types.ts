import { FileEntry } from './FileEntry.types';
import { FileSystem } from './FileSystem.types';

export interface MockFileSystem {
  MockFs: FileSystem;
  clearMockFileSystem(): void;
  resetMockFileSystem(): void;
  loadFiles(files: MockFileDescriptor[]): void;
  getFiles(): FileEntry[];
  getTrash(): FileEntry[];
  printFiles(): void;
}

export type MockFsRoot = Record<string, FileEntry>;

export type MockFileDescriptor = string | { path: string; textContent: string };
