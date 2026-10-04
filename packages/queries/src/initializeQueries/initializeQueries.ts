import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import { QueryGroupsTypeConfig } from '../QueryGroupsTypeConfig';
import { onFileSystemChanged } from '../event-handlers';
import { locales } from '../locales';

/**
 * Initializes queries by registering the translations, the query
 * groups entity group type and the listeners which keep loaded
 * workspaces' queries in step with their files.
 *
 * Must be called before the entity groups are loaded.
 */
export function initializeQueries(): void {
  // Register the translations
  I18n.registerTranslations(locales);

  // Apply changes made to query files outside of the app
  Events.on(Fs.events.Changed, 'queries', (data) => onFileSystemChanged(data));

  // Register the query groups entity group type
  EntityGroups.registerType(QueryGroupsTypeConfig);
}
