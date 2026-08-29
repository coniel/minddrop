import { describe, expect, it } from 'vitest';
import { initializeI18n } from '../initializeI18n';
import { registerTranslations } from '../registerTranslations';
import { translateAll } from './translateAll';

initializeI18n();

// Register a French translation for the untitled label so that the
// key has more than one distinct translation
registerTranslations({
  'fr-FR': { labels: { untitled: 'Sans titre' } },
});

describe('translateAll', () => {
  it('returns the translations of every registered language', () => {
    expect(translateAll('labels.untitled')).toEqual(
      expect.arrayContaining(['Untitled', 'Sans titre']),
    );
  });

  it('drops duplicate translations shared between languages', () => {
    // en-GB and en-US both resolve to the same label
    const translations = translateAll('labels.untitled');

    expect(translations.filter((label) => label === 'Untitled')).toHaveLength(
      1,
    );
  });
});
