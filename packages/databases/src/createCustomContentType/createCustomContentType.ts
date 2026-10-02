import { entityId } from '@minddrop/utils';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { CustomContentTypeEntityType } from '../constants';
import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { CustomContentType, CustomContentTypeData } from '../types';
import { normalizeContentTypeMatchers } from '../utils';
import { validateCustomContentTypeMatchers } from '../validateCustomContentTypeMatchers';

/**
 * Creates a custom content type. Its matchers are normalized and
 * deduplicated.
 *
 * @param data - The custom content type data.
 * @returns The new custom content type.
 *
 * @throws {InvalidParameterError} If a matcher is already in use.
 */
export function createCustomContentType(
  data: CustomContentTypeData,
): CustomContentType {
  // Get the configured content defaults
  const contentDefaults = getDatabaseContentDefaults();

  // Normalize and deduplicate the matchers
  const matchers = normalizeContentTypeMatchers(data.kind, data.matchers);

  // Ensure the matchers are free to use
  validateCustomContentTypeMatchers(data.kind, matchers);

  // Create the custom content type
  const customType: CustomContentType = {
    ...data,
    id: entityId(CustomContentTypeEntityType),
    matchers,
  };

  // Add the type to the store
  DatabaseSettingsStore.set('contentDefaults', {
    ...contentDefaults,
    customTypes: [...contentDefaults.customTypes, customType],
  });

  return customType;
}
