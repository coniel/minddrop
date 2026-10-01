import { Properties } from '@minddrop/properties';
import { getDatabase } from '../../getDatabase';
import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { resolveDefaultPropertyOfType } from '../resolveDefaultPropertyOfType';

/**
 * Resolves the ID of the database text is added to. The target
 * database when it exists and has a content property, otherwise the
 * database set for the text content type.
 *
 * @param targetDatabaseId - The ID of the database preferred when it can hold text.
 * @returns The database ID, or null when no default applies.
 */
export function resolveDefaultDatabaseIdForText(
  targetDatabaseId?: string,
): string | null {
  // Check if the target database exists and has a content property.
  // If so, use it.
  if (
    targetDatabaseId &&
    getDatabase(targetDatabaseId, false) &&
    resolveDefaultPropertyOfType(
      targetDatabaseId,
      Properties.schemas.content.type,
    )
  ) {
    return targetDatabaseId;
  }

  // Fall back to the text default
  return getDatabaseContentDefaults().text;
}
