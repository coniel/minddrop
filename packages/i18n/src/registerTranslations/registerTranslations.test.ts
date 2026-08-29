import { afterEach, describe, expect, it } from 'vitest';
import { translateDynamic } from '../index';
import { i18n, initializeI18n } from '../initializeI18n';
import { registerTranslations } from './registerTranslations';

initializeI18n();

describe('registerTranslations', () => {
  afterEach(async () => {
    // Restore the default language
    await i18n.changeLanguage('en-GB');
  });

  it('makes registered translations resolvable', () => {
    // Register a new translation key
    registerTranslations({
      'en-GB': { registerTranslationsTest: { greeting: 'Hello' } },
    });

    // The registered key should resolve to its translation
    expect(translateDynamic('registerTranslationsTest.greeting')).toBe('Hello');
  });

  it('registers translations for every given locale', async () => {
    // Register the same key for two locales
    registerTranslations({
      'en-GB': { registerTranslationsTest: { farewell: 'Goodbye' } },
      'fr-FR': { registerTranslationsTest: { farewell: 'Au revoir' } },
    });

    // Switch to the second locale
    await i18n.changeLanguage('fr-FR');

    // The key should resolve to the second locale's translation
    expect(translateDynamic('registerTranslationsTest.farewell')).toBe(
      'Au revoir',
    );
  });

  it('deep-merges into existing translations', () => {
    // Register an addition under an existing translation group
    registerTranslations({
      'en-GB': { actions: { registerTranslationsTestExtra: 'Extra' } },
    });

    // The added key should resolve
    expect(translateDynamic('actions.registerTranslationsTestExtra')).toBe(
      'Extra',
    );

    // The group's existing keys should remain resolvable
    expect(translateDynamic('actions.cancel')).toBe('Cancel');
  });
});
