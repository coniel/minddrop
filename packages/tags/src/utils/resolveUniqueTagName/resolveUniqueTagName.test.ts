import { describe, expect, it } from 'vitest';
import { resolveUniqueTagName } from './resolveUniqueTagName';

describe('resolveUniqueTagName', () => {
  it('returns the base name when it is free', () => {
    expect(resolveUniqueTagName('New tag', ['Other'])).toBe('New tag');
  });

  it('suffixes the lowest free number when taken', () => {
    expect(resolveUniqueTagName('New tag', ['New tag'])).toBe('New tag 2');
  });

  it('skips taken numbered names', () => {
    expect(resolveUniqueTagName('New tag', ['New tag', 'New tag 2'])).toBe(
      'New tag 3',
    );
  });

  it('ignores case when comparing names', () => {
    expect(resolveUniqueTagName('New tag', ['NEW TAG'])).toBe('New tag 2');
  });
});
