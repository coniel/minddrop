import { describe, expect, it } from 'vitest';
import { I18n, initializeI18n } from '@minddrop/i18n';
import { isUntitledTitle } from './isUntitledTitle';

// Initialize i18n so the untitled label resolves
initializeI18n();

// Register a French translation for the untitled label to test
// titles generated under a language other than the current one
I18n.registerTranslations({
  'fr-FR': { labels: { untitled: 'Sans titre' } },
});

describe('isUntitledTitle', () => {
  it('returns true for untitled labels of non-active languages', () => {
    expect(isUntitledTitle('Sans titre')).toBe(true);
    expect(isUntitledTitle('Sans titre 2')).toBe(true);
  });

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
