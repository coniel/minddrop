import { EntityGroups } from '@minddrop/entity-groups';
import { TranslationKey } from '@minddrop/i18n';

/**
 * Resolves the error a group naming raised into the message shown
 * below the name field.
 *
 * @param error - The error the naming raised.
 * @returns The message to show below the field.
 *
 * @throws The error it was given, when it is not a naming error.
 */
export function resolveEntityGroupNameError(error: unknown): TranslationKey {
  // Return the message for a duplicate name
  if (error instanceof EntityGroups.errors.DuplicateName) {
    return 'entityGroups.name.taken';
  }

  // Anything else is not a naming error
  throw error;
}
