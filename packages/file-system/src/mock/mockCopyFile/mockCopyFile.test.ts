import { describe, beforeEach, it, expect } from 'vitest';
import { mockCopyFile } from './mockCopyFile';
import { FsEntry } from '../../types';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { mockExists } from '../mockExists';

const COPY_PATH = `${workspaceA.path}/Document 1 copy.md`;

describe('copyFile', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if file entry does not exist', () => {
    expect(async () => mockCopyFile(root, 'foo', COPY_PATH)).rejects.toThrow();
  });

  it('copies the file to a new path', () => {
    mockCopyFile(root, documentA1.path, COPY_PATH);

    expect(mockExists(root, COPY_PATH)).toBe(true);
  });
});
