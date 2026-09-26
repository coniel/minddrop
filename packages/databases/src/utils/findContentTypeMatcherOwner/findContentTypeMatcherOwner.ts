import { FileBasedPropertyType, Properties } from '@minddrop/properties';
import { CustomContentType, CustomContentTypeKind } from '../../types';
import { findCustomContentTypeByMatcher } from '../findCustomContentTypeByMatcher';

/**
 * Finds the content type already using a custom content type
 * matcher. A file extension can belong to a built-in file content
 * type, and any matcher to another custom content type of the kind.
 *
 * @param kind - The custom content type kind.
 * @param matcher - The matcher, normalized or not.
 * @param ownId - The ID of a custom type to ignore.
 * @returns The built-in file content type or the custom content type using the matcher, or null when it is free.
 */
export function findContentTypeMatcherOwner(
  kind: CustomContentTypeKind,
  matcher: string,
  ownId?: string,
): FileBasedPropertyType | CustomContentType | null {
  // Check if the matcher is a file extension
  if (kind === 'file') {
    // Resolve the extension's built-in file content type
    const fileContentType = Properties.resolveFilePropertyType(matcher);

    // Check if the file content type is a specific one. If so, return
    // it. The catch-all file type has no extensions of its own.
    if (fileContentType !== 'file') {
      return fileContentType;
    }
  }

  // Find another custom type listing the matcher
  const customType = findCustomContentTypeByMatcher(kind, matcher);

  // Check if a custom type other than the ignored one lists the
  // matcher. If so, return it.
  if (customType && customType.id !== ownId) {
    return customType;
  }

  return null;
}
