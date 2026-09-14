import { EntityGroups } from '@minddrop/entity-groups';
import { I18n } from '@minddrop/i18n';
import { locales } from './locales';
import { tagGroupsTypeConfig } from './tagGroupsTypeConfig';

/**
 * Initializes the tags package.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeTags(): void {
  // Register the package's translations
  I18n.registerTranslations(locales);

  // Register the tag groups entity group type
  EntityGroups.registerType(tagGroupsTypeConfig);
}
