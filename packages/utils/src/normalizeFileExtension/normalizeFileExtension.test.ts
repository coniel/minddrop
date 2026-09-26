import { describe, expect, it } from 'vitest';
import { normalizeFileExtension } from './normalizeFileExtension';

describe('normalizeFileExtension', () => {
  it('strips every leading dot', () => {
    expect(normalizeFileExtension('..epub')).toBe('epub');
  });

  it('lowercases the extension', () => {
    expect(normalizeFileExtension('PDF')).toBe('pdf');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeFileExtension('  mp3 ')).toBe('mp3');
  });
});
