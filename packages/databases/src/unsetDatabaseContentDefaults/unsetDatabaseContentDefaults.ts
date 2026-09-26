import { ContentTypes } from '../constants';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { setDatabaseContentDefault } from '../setDatabaseContentDefault';
import { updateCustomContentType } from '../updateCustomContentType';

/**
 * Unsets every content default set to a given database.
 *
 * @param databaseId - The ID of the database.
 */
export function unsetDatabaseContentDefaults(databaseId: string): void {
  // Get the configured content defaults
  const defaults = getDatabaseContentDefaults();

  // Unset the content type defaults set to the database
  ContentTypes.forEach((contentType) => {
    if (defaults[contentType] === databaseId) {
      setDatabaseContentDefault(contentType, null);
    }
  });

  // Unset the database of each custom content type set to it
  defaults.customTypes.forEach((customType) => {
    if (customType.databaseId === databaseId) {
      updateCustomContentType(customType.id, { databaseId: null });
    }
  });
}
