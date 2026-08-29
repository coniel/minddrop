import { Databases } from '@minddrop/databases';
import type { FullTextMatchedProperty } from '../../types';
import { extractSnippet } from '../extractSnippet';
import { highlightAllMatches } from '../highlightAllMatches';

// Property types that contain long-form text and should
// be returned as snippets rather than full values
const LONG_TEXT_TYPES = new Set(['text', 'formatted-text']);

// Maximum value length (in characters) before snippeting kicks in
const SNIPPET_THRESHOLD = 80;

/**
 * Finds which properties on an entry match the search query
 * terms via case-insensitive substring matching. Returns at
 * most one match per property name. For long text properties,
 * returns a snippet with highlight markers around the match.
 *
 * @param entryId - The ID of the entry whose properties to check.
 * @param queryTerms - The lowercased query terms to match against.
 * @returns The matched properties with highlighted values.
 */
export function findMatchedProperties(
  entryId: string,
  queryTerms: string[],
): FullTextMatchedProperty[] {
  const propertyValues = Databases.sql.getEntryPropertyValues(entryId);

  // Group matched values by property name so multi-value
  // properties (select, collection) show all matching values
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

    let value: string;

    // For long text properties, extract a snippet around the first match
    if (
      LONG_TEXT_TYPES.has(property.type) &&
      property.value.length > SNIPPET_THRESHOLD
    ) {
      value = extractSnippet(property.value, matchingTerms);
    } else {
      value = highlightAllMatches(property.value, matchingTerms);
    }

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
