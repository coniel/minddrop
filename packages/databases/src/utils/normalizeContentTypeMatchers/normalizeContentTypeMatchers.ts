import { CustomContentTypeKind } from '../../types';
import { normalizeContentTypeMatcher } from '../normalizeContentTypeMatcher';

/**
 * Normalizes custom content type matchers as they are stored. Removes
 * duplicates.
 *
 * @param kind - The custom content type kind.
 * @param matchers - The matchers to normalize.
 * @returns The normalized matchers, in their original order.
 */
export function normalizeContentTypeMatchers(
  kind: CustomContentTypeKind,
  matchers: string[],
): string[] {
  // Normalize each matcher
  const normalizedMatchers = matchers.map((matcher) =>
    normalizeContentTypeMatcher(kind, matcher),
  );

  // Remove the duplicates
  return [...new Set(normalizedMatchers)];
}
