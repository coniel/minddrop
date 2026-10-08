import { Databases } from '@minddrop/databases';
import type { FullTextMatchedProperty } from '../../types';
import { highlightAllMatches } from '../highlightAllMatches';

/**
 * Finds which of an entry's short property values match the
 * search query terms via case-insensitive substring matching.
 * Returns at most one match per property name, with highlight
 * markers around the matched terms. Text and content property
 * values are not checked.
 *
 * @param workspaceId - The workspace the entry belongs to.
 * @param entryId - The ID of the entry whose properties to check.
 * @param queryTerms - The lowercased query terms to match against.
 * @returns The matched properties with highlighted values.
 */
export function findMatchedProperties(
  workspaceId: string,
  entryId: string,
  queryTerms: string[],
): FullTextMatchedProperty[] {
  // Get the entry's short property values
  const propertyValues = Databases.sql.getEntryPropertyValues(
    entryId,
    workspaceId,
  );

  // Group matched values by property name so multi-value
  // properties (select, collection) show all matching values.
  const matchesByName = new Map<string, { type: string; values: string[] }>();

  for (const property of propertyValues) {
    const lowerValue = property.value.toLowerCase();

    // Find all query terms that match this property value
    const matchingTerms = queryTerms.filter((term) =>
      lowerValue.includes(term),
    );

    if (matchingTerms.length === 0) {
      continue;
    }

    // Highlight the matched terms
    const value = highlightAllMatches(property.value, matchingTerms);

    // Append to the property's matches, creating them on first match
    const existing = matchesByName.get(property.name);

    if (existing) {
      existing.values.push(value);
    } else {
      matchesByName.set(property.name, {
        type: property.type,
        values: [value],
      });
    }
  }

  // Build the result, joining multiple values with a comma
  const matched: FullTextMatchedProperty[] = [];

  for (const [name, { type, values }] of matchesByName) {
    matched.push({ name, type, value: values.join(', ') });
  }

  return matched;
}
