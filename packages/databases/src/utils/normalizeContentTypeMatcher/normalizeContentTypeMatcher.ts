import { normalizeDomain, normalizeFileExtension } from '@minddrop/utils';
import { CustomContentTypeKind } from '../../types';

/**
 * Normalizes a custom content type matcher as it is stored: a file
 * extension for the file kind, a domain for the URL kind.
 *
 * @param kind - The custom content type kind.
 * @param matcher - The matcher to normalize.
 * @returns The normalized matcher.
 */
export function normalizeContentTypeMatcher(
  kind: CustomContentTypeKind,
  matcher: string,
): string {
  // Normalize file kind matchers as file extensions
  if (kind === 'file') {
    return normalizeFileExtension(matcher);
  }

  // Normalize URL kind matchers as domains
  return normalizeDomain(matcher);
}
