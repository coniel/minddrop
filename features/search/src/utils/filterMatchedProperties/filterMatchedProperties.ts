import type { FullTextMatchedProperty } from '@minddrop/search';

/**
 * Filters out image properties when there are other
 * non-image matches available.
 */
export function filterMatchedProperties(
  properties: FullTextMatchedProperty[],
): FullTextMatchedProperty[] {
  const nonImage = properties.filter((property) => property.type !== 'image');

  if (nonImage.length > 0) {
    return nonImage;
  }

  return properties;
}
