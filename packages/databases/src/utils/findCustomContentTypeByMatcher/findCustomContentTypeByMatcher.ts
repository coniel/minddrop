import { getDatabaseContentDefaults } from '../../getDatabaseContentDefaults';
import { CustomContentType, CustomContentTypeKind } from '../../types';
import { normalizeContentTypeMatcher } from '../normalizeContentTypeMatcher';

/**
 * Finds the custom content type of a given kind which lists a
 * matcher.
 *
 * @param kind - The custom content type kind.
 * @param matcher - The matcher, normalized or not.
 * @returns The custom content type, or null when none lists the matcher.
 */
export function findCustomContentTypeByMatcher(
  kind: CustomContentTypeKind,
  matcher: string,
): CustomContentType | null {
  // Normalize the matcher as the types store theirs
  const normalizedMatcher = normalizeContentTypeMatcher(kind, matcher);

  // Find the type of the kind listing the matcher
  const customType = getDatabaseContentDefaults().customTypes.find(
    (type) => type.kind === kind && type.matchers.includes(normalizedMatcher),
  );

  return customType ?? null;
}
