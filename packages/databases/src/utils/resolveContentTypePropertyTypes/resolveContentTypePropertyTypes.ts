import { PropertyType } from '@minddrop/properties';
import { ContentType } from '../../types';

/**
 * Resolves the property types which can hold content of a given
 * type.
 *
 * @param contentType - The content type.
 * @returns The property types accepting the content type.
 */
export function resolveContentTypePropertyTypes(
  contentType: ContentType,
): PropertyType[] {
  // Return the content property type for text
  if (contentType === 'text') {
    return ['content'];
  }

  // Return the URL property type for URLs
  if (contentType === 'url') {
    return ['url'];
  }

  // Return the generic file property type for the catch-all file type
  if (contentType === 'file') {
    return ['file'];
  }

  // Return the generic file property type and the file type's own
  // property type.
  return ['file', contentType];
}
