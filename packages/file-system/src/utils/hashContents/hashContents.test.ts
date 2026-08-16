import { describe, expect, it } from 'vitest';
import { hashContents } from './hashContents';

describe('hashContents', () => {
  it('returns the same hash for identical contents', () => {
    expect(hashContents('# Title\n\nSome text')).toBe(
      hashContents('# Title\n\nSome text'),
    );
  });

  it('returns different hashes for differing contents', () => {
    expect(hashContents('# Title')).not.toBe(hashContents('# Other'));
  });

  it('returns different hashes for contents differing only in length', () => {
    expect(hashContents('abc')).not.toBe(hashContents('abcd'));
  });

  it('handles empty contents', () => {
    expect(hashContents('')).toBe(hashContents(''));
  });
});
