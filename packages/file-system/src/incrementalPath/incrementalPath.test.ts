import { describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '../mock';
import { incrementalPath } from './incrementalPath';

const { setFiles, MockFs } = initializeMockFileSystem(['Documents']);

describe('incrementalFilename', () => {
  it('returns the path as is if the path does not alredy exist', async () => {
    // Get incremental path
    const result = await incrementalPath(MockFs, 'Documents/foo');

    // Should return original target path
    expect(result).toEqual({
      path: 'Documents/foo',
      name: 'foo',
      title: 'foo',
    });
  });

  it('increments path if the path already exists', async () => {
    // Add a conflicting file
    setFiles(['Documents/foo']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'Documents/foo');

    // Should increment path by 1
    expect(result).toEqual({
      path: 'Documents/foo 1',
      name: 'foo 1',
      title: 'foo 1',
      increment: 1,
    });
  });

  it('recursively increments path if incremented path already exists', async () => {
    // Add multiple levels of conflicting files
    setFiles(['Documents/foo', 'Documents/foo 1', 'Documents/foo 2']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'Documents/foo');

    // Should increment path by 3
    expect(result).toEqual({
      path: 'Documents/foo 3',
      name: 'foo 3',
      title: 'foo 3',
      increment: 3,
    });
  });

  it('adds increment suffix before file extension', async () => {
    // Add a conflicting file with a file extension
    setFiles(['Documents/foo.md']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'Documents/foo.md');

    expect(result).toEqual({
      path: 'Documents/foo 1.md',
      name: 'foo 1.md',
      title: 'foo 1',
      increment: 1,
    });
  });

  it('ignores file extensions if requested', async () => {
    // Add a conflicting file with a different file extension
    setFiles(['Documents/foo.pdf', 'Documents/foo 1.md']);

    // Get incremental path, ignoring file extension
    const result = await incrementalPath(MockFs, 'Documents/foo.md', true);

    expect(result).toEqual({
      path: 'Documents/foo 2.md',
      name: 'foo 2.md',
      title: 'foo 2',
      increment: 2,
    });
  });
});
