import { describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { relativePath } from './relativePath';

describe('relativePath', () => {
  it('strips the directory prefix', () => {
    expect(relativePath('path/to/workspace', 'path/to/workspace/Notes')).toBe(
      'Notes',
    );
  });

  it('keeps nested segments', () => {
    expect(
      relativePath('path/to/workspace', 'path/to/workspace/Notes/note.md'),
    ).toBe('Notes/note.md');
  });

  it("ignores the directory's trailing slash", () => {
    expect(relativePath('path/to/workspace/', 'path/to/workspace/Notes')).toBe(
      'Notes',
    );
  });

  it('returns an empty path for the directory itself', () => {
    expect(relativePath('path/to/workspace', 'path/to/workspace')).toBe('');
  });

  it('throws if the path is not inside the directory', () => {
    expect(() =>
      relativePath('path/to/workspace', 'path/to/other/Notes'),
    ).toThrow(InvalidParameterError);
  });

  it('throws on an empty directory rather than stripping the leading slash', () => {
    expect(() => relativePath('', '/Users/test/Notes')).toThrow(
      InvalidParameterError,
    );
    expect(() => relativePath('/', '/Users/test/Notes')).toThrow(
      InvalidParameterError,
    );
  });

  it('throws on a partial segment match', () => {
    expect(() =>
      relativePath('path/to/workspace', 'path/to/workspace-2/Notes'),
    ).toThrow(InvalidParameterError);
  });
});
