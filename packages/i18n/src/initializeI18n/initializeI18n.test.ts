import { describe, expect, it } from 'vitest';
import { i18n, initializeI18n } from './initializeI18n';

initializeI18n();

describe('initializeI18n', () => {
  it('registers the bundled locale resources', () => {
    // Each bundled locale should have a registered resource bundle
    expect(i18n.hasResourceBundle('en-GB', 'core')).toBe(true);
    expect(i18n.hasResourceBundle('en-US', 'core')).toBe(true);
    expect(i18n.hasResourceBundle('fr-FR', 'core')).toBe(true);
  });

  it('resolves translations from the bundled locales', () => {
    // Keys should resolve to their bundled translations
    expect(i18n.t('actions.cancel')).toBe('Cancel');
  });
});
