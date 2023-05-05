import { vi } from 'vitest';
import { FileSystem } from '@minddrop/core';

export const MockFsAdapter: FileSystem = {
  copyFile: vi.fn(),
  createDir: vi.fn(),
  exists: vi.fn(),
  readBinaryFile: vi.fn(),
  readDir: vi.fn(),
  readTextFile: vi.fn(),
  removeDir: vi.fn(),
  removeFile: vi.fn(),
  renameFile: vi.fn(),
  writeBinaryFile: vi.fn(),
  writeTextFile: vi.fn(),
};
