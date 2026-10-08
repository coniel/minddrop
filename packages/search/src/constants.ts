// Unicode private-use-area codepoints used as markers around
// matched terms in search result property values. These will
// not appear in normal text content.
export const MATCH_HIGHLIGHT_START = '\uE000';
export const MATCH_HIGHLIGHT_END = '\uE001';

/**
 * The highlight markers exposed to consumers for parsing
 * marked matches out of search result values.
 */
export const searchConstants = {
  matchHighlightStart: MATCH_HIGHLIGHT_START,
  matchHighlightEnd: MATCH_HIGHLIGHT_END,
};
