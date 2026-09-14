import { InvalidParameterError } from '@minddrop/utils';
import { DuplicateEntityGroupNameError } from '../../errors';
import { EntityGroup } from '../../types';

/**
 * Validates a group name against the groups of its type, returning
 * it trimmed. A name is non-empty and unique among the type's
 * groups, compared case-insensitively.
 *
 * @param name - The name to validate.
 * @param groups - The type's groups.
 * @param excludeId - The ID of the group being renamed, left out of the uniqueness check.
 * @returns The trimmed name.
 *
 * @throws {InvalidParameterError} If the name is empty.
 * @throws {DuplicateEntityGroupNameError} If another group of the type has the name.
 */
export function validateEntityGroupName(
  name: string,
  groups: EntityGroup[],
  excludeId?: string,
): string {
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new InvalidParameterError('entity group name cannot be empty');
  }

  const duplicate = groups.some(
    (group) =>
      group.id !== excludeId &&
      group.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (duplicate) {
    throw new DuplicateEntityGroupNameError(trimmedName);
  }

  return trimmedName;
}
