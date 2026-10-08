import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '../FileSystem';
import { initializeMockFileSystem } from '../mock';
import { BaseDirectory } from '../types';
import { resolveAbsolutePath } from './resolveAbsolutePath';

describe('resolveAbsolutePath', () => {
  beforeEach(async () => {
    initializeMockFileSystem();

    // Let the base directory paths resolve
    await Promise.resolve();
  });

  afterEach(() => Fs.tests.cleanup());

  it('returns a path outside a base directory as it is', () => {
    expect(resolveAbsolutePath('dir/file.json')).toBe('dir/file.json');
  });

  it("joins a path within a base directory onto the base directory's path", () => {
    // The mock adapter resolves a base directory's path to its name
    expect(resolveAbsolutePath('dir/file.json', BaseDirectory.AppData)).toBe(
      `${BaseDirectory.AppData}/dir/file.json`,
    );
  });
});
