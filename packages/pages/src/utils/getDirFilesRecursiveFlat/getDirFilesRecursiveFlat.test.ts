import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { getDirFilesRecursiveFlat } from './getDirFilesRecursiveFlat';

const GRAND_CHILD_FILE = { path: 'path/subpath/file' };
const CHILD_FILE = { path: 'path/subpath_file' };

const readDir = async () => [
  {
    path: 'path',
    children: [
      CHILD_FILE,
      { path: 'path/subpath_dir', children: [GRAND_CHILD_FILE] },
    ],
  },
];

registerFileSystemAdapter({ ...MockFsAdapter, readDir });

describe('getDirFilesRecursiveFlat', () => {
  it('returns a flattened list of file entries', async () => {
    // Get the files for a dir
    const files = await getDirFilesRecursiveFlat('path');

    // Should return flattened file list
    expect(files).toEqual([CHILD_FILE, GRAND_CHILD_FILE]);
  });
});
