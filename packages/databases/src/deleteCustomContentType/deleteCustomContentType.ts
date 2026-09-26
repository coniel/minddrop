import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { getCustomContentType } from '../getCustomContentType';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';

/**
 * Deletes a custom content type.
 *
 * @param id - The ID of the custom content type.
 *
 * @throws {CustomContentTypeNotFoundError} If the type does not exist.
 */
export function deleteCustomContentType(id: string): void {
  // Ensure the type exists
  getCustomContentType(id);

  // Get the configured content defaults
  const contentDefaults = getDatabaseContentDefaults();

  // Remove the type from the store
  DatabaseSettingsStore.set('contentDefaults', {
    ...contentDefaults,
    customTypes: contentDefaults.customTypes.filter((type) => type.id !== id),
  });
}
