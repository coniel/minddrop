import { describe, beforeEach, it, expect } from 'vitest';
import { mockCopyFile } from './mockCopyFile';
import { FsEntry } from '../../types';
import { createTestFsRoot, pageA1, workspaceA } from '../../test-utils';
import { mockExists } from '../mockExists';

const COPY_PATH = `${workspaceA.path}/Page 1 copy.md`;

describe('copyFile', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if file entry does not exist', () => {
    expect(async () => mockCopyFile(root, 'foo', COPY_PATH)).rejects.toThrow();
  });

  it('copies the file to a new path', () => {
    mockCopyFile(root, pageA1.path, COPY_PATH);

    expect(mockExists(root, COPY_PATH)).toBe(true);
  });
});
