import { describe, expect, it } from 'vitest';
import { removeFileExtension } from './removeFileExtension';

describe('removeFileExtension', () => {
  it('removes the file extension from a path', () => {
    const path = 'path/to/file.txt';
    const expected = 'path/to/file';

    expect(removeFileExtension(path)).toBe(expected);
  });

  it('supports paths without an extension', () => {
    const path = 'path/to/file';
    const expected = 'path/to/file';

    expect(removeFileExtension(path)).toBe(expected);
  });

  it('supports paths with multiple dots', () => {
    const path = 'path/to/file.with.multiple.dots.txt';
    const expected = 'path/to/file.with.multiple.dots';

    expect(removeFileExtension(path)).toBe(expected);
  });
});
