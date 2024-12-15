import { describe, expect, it } from 'vitest';
import { fileNameFromPath } from './fileNameFromPath';

describe('fileNameFromPath', () => {
  it('returns the file name', () => {
    expect(fileNameFromPath('path/to/Foo.md')).toBe('Foo.md');
  });
});
