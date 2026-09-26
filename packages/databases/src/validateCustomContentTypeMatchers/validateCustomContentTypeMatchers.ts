import { InvalidParameterError } from '@minddrop/utils';
import { CustomContentTypeKind } from '../types';
import { findContentTypeMatcherOwner } from '../utils';

/**
 * Validates that normalized custom content type matchers are free to
 * use. File extensions must not belong to a built-in file content
 * type, and no matcher may be listed by another custom type of the
 * same kind.
 *
 * @param kind - The custom content type kind.
 * @param matchers - The normalized matchers to validate.
 * @param ownId - The ID of the custom type the matchers belong to. Its own matchers are not a conflict.
 *
 * @throws {InvalidParameterError} If a matcher is already in use.
 */
export function validateCustomContentTypeMatchers(
  kind: CustomContentTypeKind,
  matchers: string[],
  ownId?: string,
): void {
  // Check each matcher for a conflict
  matchers.forEach((matcher) => {
    // Find the content type already using the matcher
    const owner = findContentTypeMatcherOwner(kind, matcher, ownId);

    // Check if a built-in file content type has the extension. If so,
    // reject it.
    if (typeof owner === 'string') {
      throw new InvalidParameterError(
        `file extension '${matcher}' belongs to the built-in '${owner}' content type.`,
      );
    }

    // Check if another custom type lists the matcher. If so, reject it.
    if (owner) {
      throw new InvalidParameterError(
        `matcher '${matcher}' is already used by the '${owner.name}' content type.`,
      );
    }
  });
}
