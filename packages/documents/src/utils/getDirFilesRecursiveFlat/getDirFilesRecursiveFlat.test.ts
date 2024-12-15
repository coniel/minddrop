import { describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { getDirFilesRecursiveFlat } from './getDirFilesRecursiveFlat';

const CHILD_FILE = { path: 'path/file.md', name: 'file.md' };
const GRAND_CHILD_FILE = { path: 'path/subpath/file 2.md', name: 'file 2.md' };

initializeMockFileSystem([CHILD_FILE.path, GRAND_CHILD_FILE.path]);

describe('getDirFilesRecursiveFlat', () => {
  it('returns a flattened list of file entries', async () => {
    // Get the files for a dir
    const files = await getDirFilesRecursiveFlat('path');

    // Should return flattened file list
    expect(files).toEqual([CHILD_FILE, GRAND_CHILD_FILE]);
  });
});
