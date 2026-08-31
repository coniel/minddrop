import { InvalidParameterError } from '@minddrop/utils';
import { TagGroupsStore } from '../../TagGroupsStore';

/**
 * Validates a tag group name, returning it trimmed. Names must be
 * non-empty and unique across all groups (case-insensitive).
 *
 * @param name - The group name to validate.
 * @param excludeGroupId - ID of a group to exclude from the uniqueness check (when renaming).
 * @returns The trimmed group name.
 *
 * @throws InvalidParameterError if the name is empty or already in use.
 */
export function validateTagGroupName(
  name: string,
  excludeGroupId?: string,
): string {
  // Trim surrounding whitespace
  const trimmedName = name.trim();

  // Reject empty names
  if (!trimmedName) {
    throw new InvalidParameterError('Tag group name cannot be empty');
  }

  // Check for an existing group with the same name (case-insensitive)
  const duplicate = TagGroupsStore.getAllArray().find(
    (group) =>
      group.id !== excludeGroupId &&
      group.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  // Reject duplicate names
  if (duplicate) {
    throw new InvalidParameterError(
      `A tag group named '${trimmedName}' already exists`,
    );
  }

  return trimmedName;
}
