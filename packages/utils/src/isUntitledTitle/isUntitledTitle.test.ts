import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { isUntitledTitle } from './isUntitledTitle';

// Initialize i18n so the untitled label resolves
initializeI18n();

describe('isUntitledTitle', () => {
  it('returns true for the untitled label', () => {
    expect(isUntitledTitle('Untitled')).toBe(true);
  });

  it('returns true for incremented untitled titles', () => {
    expect(isUntitledTitle('Untitled 1')).toBe(true);
    expect(isUntitledTitle('Untitled 42')).toBe(true);
  });

  it('returns false for regular titles', () => {
    expect(isUntitledTitle('My document')).toBe(false);
  });

  it('returns false for titles containing the untitled label', () => {
    expect(isUntitledTitle('Untitled thoughts')).toBe(false);
    expect(isUntitledTitle('My Untitled document')).toBe(false);
  });

  it('returns false for non-incremented suffixes', () => {
    expect(isUntitledTitle('Untitled1')).toBe(false);
    expect(isUntitledTitle('Untitled 1a')).toBe(false);
  });

  it('is case sensitive', () => {
    expect(isUntitledTitle('untitled')).toBe(false);
  });

  it('returns false for an empty title', () => {
    expect(isUntitledTitle('')).toBe(false);
  });
});
