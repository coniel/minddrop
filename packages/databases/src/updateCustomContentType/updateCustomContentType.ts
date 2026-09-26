import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { getCustomContentType } from '../getCustomContentType';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { CustomContentType, CustomContentTypeData } from '../types';
import { normalizeContentTypeMatchers } from '../utils';
import { validateCustomContentTypeMatchers } from '../validateCustomContentTypeMatchers';

/**
 * The changes an update applies to a custom content type. Its kind
 * is fixed at creation.
 */
export type CustomContentTypeChanges = Partial<
  Omit<CustomContentTypeData, 'kind'>
>;

/**
 * Updates a custom content type. Given matchers replace the type's
 * matchers. They are normalized and deduplicated.
 *
 * @param id - The ID of the custom content type.
 * @param changes - The changes to apply.
 * @returns The updated custom content type.
 *
 * @throws {CustomContentTypeNotFoundError} If the type does not exist.
 * @throws {InvalidParameterError} If a matcher is already in use.
 */
export function updateCustomContentType(
  id: string,
  changes: CustomContentTypeChanges,
): CustomContentType {
  // Get the type
  const customType = getCustomContentType(id);
  // Get the configured content defaults
  const contentDefaults = getDatabaseContentDefaults();

  // Apply the changes to the type
  const updatedType: CustomContentType = { ...customType, ...changes };

  // Check if the changes include matchers
  if (changes.matchers) {
    // Normalize and deduplicate the matchers
    updatedType.matchers = normalizeContentTypeMatchers(
      customType.kind,
      changes.matchers,
    );

    // Ensure the matchers are free to use
    validateCustomContentTypeMatchers(
      customType.kind,
      updatedType.matchers,
      id,
    );
  }

  // Replace the type in the store
  DatabaseSettingsStore.set('contentDefaults', {
    ...contentDefaults,
    customTypes: contentDefaults.customTypes.map((type) =>
      type.id === id ? updatedType : type,
    ),
  });

  return updatedType;
}
