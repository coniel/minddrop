import { describe, expect, it } from 'vitest';
import { escapeLikePattern } from './escapeLikePattern';

describe('escapeLikePattern', () => {
  it('escapes percent signs', () => {
    expect(escapeLikePattern('100%')).toBe('100\\%');
  });

  it('escapes underscores', () => {
    expect(escapeLikePattern('foo_bar')).toBe('foo\\_bar');
  });

  it('escapes backslashes', () => {
    expect(escapeLikePattern('foo\\bar')).toBe('foo\\\\bar');
  });

  it('leaves other characters untouched', () => {
    expect(escapeLikePattern('foo bar')).toBe('foo bar');
  });
});
