import { describe, expect, it } from 'vitest';
import { humanizeIconName } from './humanizeIconName';

describe('humanizeIconName', () => {
  it('replaces hyphens with spaces and capitalises the first letter', () => {
    expect(humanizeIconName('circle-chevron-down')).toBe('Circle chevron down');
  });

  it('capitalises names without hyphens', () => {
    expect(humanizeIconName('cat')).toBe('Cat');
  });

  it('returns an empty string as is', () => {
    expect(humanizeIconName('')).toBe('');
  });
});
