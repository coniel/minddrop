import { getDatabaseContentDefaults } from '../getDatabaseContentDefaults';
import { CustomContentType } from '../types';

/**
 * Retrieves the user-defined content types, in creation order.
 *
 * @returns The custom content types.
 */
export function getCustomContentTypes(): CustomContentType[] {
  return getDatabaseContentDefaults().customTypes;
}
