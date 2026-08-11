import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('lowercases the text', () => {
    expect(slugify('Panel View')).toBe('panel-view');
  });

  it('replaces runs of unsupported characters with a single dash', () => {
    expect(slugify('space / notes (draft)')).toBe('space-notes-draft');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('  spaces  ')).toBe('spaces');
  });

  it('preserves digits', () => {
    expect(slugify('Version 2 panel')).toBe('version-2-panel');
  });

  it('returns an empty string when there are no usable characters', () => {
    expect(slugify('!!!')).toBe('');
    expect(slugify('')).toBe('');
  });
});
