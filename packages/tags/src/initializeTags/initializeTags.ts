import { I18n } from '@minddrop/i18n';
import { loadTagGroups } from '../loadTagGroups';
import { loadTags } from '../loadTags';
import { locales } from '../locales';

/**
 * Initializes tags by loading tags and tag groups into their
 * stores.
 */
export async function initializeTags(): Promise<void> {
  // Register tag translations
  I18n.registerTranslations(locales);

  // Load tags into the store
  await loadTags();

  // Load tag groups into the store
  await loadTagGroups();
}
