import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { ContentType } from '../types';

/**
 * Sets the database that content of a given type is added to.
 *
 * @param contentType - The content type to set the database for.
 * @param databaseId - The ID of the database, or null to unset it.
 */
export function setDatabaseContentDefault(
  contentType: ContentType,
  databaseId: string | null,
): void {
  // Update the default in the store
  DatabaseSettingsStore.set('contentDefaults', {
    ...getDatabaseContentDefaults(),
    [contentType]: databaseId,
  });
}
