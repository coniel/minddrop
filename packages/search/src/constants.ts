import { PropertyType } from '@minddrop/properties';

// Unicode private-use-area codepoints used as markers around
// matched terms in search result property values. These will
// not appear in normal text content.
export const MATCH_HIGHLIGHT_START = '\uE000';
export const MATCH_HIGHLIGHT_END = '\uE001';

// Property types excluded from the MiniSearch full-text index.
// These are still stored in SQLite for structured queries.
export const FUZZY_SEARCH_EXCLUDED_PROPERTY_TYPES = new Set<PropertyType>([
  'collection',
]);

// SQL exclusion list built from the excluded property types
// constant, used in WHERE clauses to filter out non-searchable
// property types
export const EXCLUDED_TYPES_SQL = [...FUZZY_SEARCH_EXCLUDED_PROPERTY_TYPES]
  .map((type) => `'${type}'`)
  .join(', ');
