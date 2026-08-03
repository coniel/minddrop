import { describe, expect, it } from 'vitest';
import { validateDirName } from './validateDirName';

const errorKey = 'error.invalidDirName';

describe('validateDirName', () => {
  it('accepts a plain name', () => {
    expect(validateDirName('Media')).toBeUndefined();
  });

  it('accepts names with spaces and hyphens', () => {
    expect(validateDirName('My Media-Files')).toBeUndefined();
  });

  it('accepts an empty name', () => {
    expect(validateDirName('')).toBeUndefined();
    expect(validateDirName('   ')).toBeUndefined();
  });

  it('rejects path separators', () => {
    expect(validateDirName('Foo/Bar')).toBe(errorKey);
    expect(validateDirName('Foo\\Bar')).toBe(errorKey);
  });

  it('rejects other filesystem-unsafe characters', () => {
    for (const name of ['Foo:Bar', 'Foo*', 'Foo?', 'Foo"', 'Foo<Bar>', 'a|b']) {
      expect(validateDirName(name)).toBe(errorKey);
    }
  });

  it('rejects the current and parent directory references', () => {
    expect(validateDirName('.')).toBe(errorKey);
    expect(validateDirName('..')).toBe(errorKey);
  });

  it('rejects hidden directory names by default', () => {
    expect(validateDirName('.Media')).toBe(errorKey);
  });

  it('allows hidden directory names when opted in', () => {
    expect(validateDirName('.Media', true)).toBeUndefined();
  });
});
