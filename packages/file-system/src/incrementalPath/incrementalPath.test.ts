import { describe, it, expect } from 'vitest';
import { initializeMockFileSystem } from '../mock';
import { incrementalPath } from './incrementalPath';

const { setFiles, MockFs } = initializeMockFileSystem();

describe('incrementalFilename', () => {
  it('returns the path as is if the path does not alredy exist', async () => {
    // Get incremental path
    const result = await incrementalPath(MockFs, '/foo');

    // Should return original target path
    expect(result).toEqual({ path: '/foo', name: 'foo' });
  });

  it('increments path if the path already exists', async () => {
    // Add a conflicting file
    setFiles(['foo']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'foo');

    // Should increment path by 1
    expect(result).toEqual({ path: 'foo 1', name: 'foo 1', increment: 1 });
  });

  it('recursively increments path if incremented path already exists', async () => {
    // Add multiple levels of conflicting files
    setFiles(['foo', 'foo 1', 'foo 2']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'foo');

    // Should increment path by 3
    expect(result).toEqual({ path: 'foo 3', name: 'foo 3', increment: 3 });
  });

  it('adds increment suffix before file extension', async () => {
    // Add a conflicting file with a file extension
    setFiles(['foo.md']);

    // Get incremental path
    const result = await incrementalPath(MockFs, 'foo.md');

    expect(result).toEqual({
      path: 'foo 1.md',
      name: 'foo 1.md',
      increment: 1,
    });
  });
});
