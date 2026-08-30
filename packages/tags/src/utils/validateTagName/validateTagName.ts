import { InvalidParameterError } from '@minddrop/utils';
import { TagsStore } from '../../TagsStore';

/**
 * Validates a tag name, returning it trimmed. Names must be
 * non-empty and unique across all tags (case-insensitive) as
 * entry property values reference tags by name.
 *
 * @param name - The tag name to validate.
 * @param excludeTagId - ID of a tag to exclude from the uniqueness check (when renaming).
 * @returns The trimmed tag name.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 */
export function validateTagName(name: string, excludeTagId?: string): string {
  // Trim surrounding whitespace
  const trimmedName = name.trim();

  // Reject empty names
  if (!trimmedName) {
    throw new InvalidParameterError('Tag name cannot be empty');
  }

  // Check for an existing tag with the same name (case-insensitive)
  const duplicate = TagsStore.getAllArray().find(
    (tag) =>
      tag.id !== excludeTagId &&
      tag.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  // Reject duplicate names
  if (duplicate) {
    throw new InvalidParameterError(
      `A tag named '${trimmedName}' already exists`,
    );
  }

  return trimmedName;
}
