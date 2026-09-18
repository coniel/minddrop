import { EntityGroups } from '@minddrop/entity-groups';
import { I18n } from '@minddrop/i18n';
import { TagGroupsTypeConfig } from './TagGroupsTypeConfig';
import { locales } from './locales';

/**
 * Initializes the tags package.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeTags(): void {
  // Register the package's translations
  I18n.registerTranslations(locales);

  // Register the tag groups entity group type
  EntityGroups.registerType(TagGroupsTypeConfig);
}
