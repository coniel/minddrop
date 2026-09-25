import type { FullTextMatchedProperty } from '@minddrop/search';

/**
 * Filters out image properties when there are other matches
 * available. Image file names are often random strings, so a match
 * on one says little about the entry compared to a match on any
 * other property.
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
