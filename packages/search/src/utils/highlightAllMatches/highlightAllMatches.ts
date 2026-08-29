import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../../constants';

/**
 * Wraps all occurrences of all matching terms in highlight
 * markers. Builds a single regex from all terms to avoid
 * double-highlighting overlapping matches.
 *
 * @param text - The text to highlight matches in.
 * @param terms - The matching terms to wrap in markers.
 * @returns The text with all matches wrapped in markers.
 */
export function highlightAllMatches(text: string, terms: string[]): string {
  // Nothing to highlight without terms
  if (terms.length === 0) {
    return text;
  }

  // Sort terms by length descending so longer terms match first
  const sorted = [...terms].sort((a, b) => b.length - a.length);

  // Escape regex special characters in the terms
  const escaped = sorted.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );

  // Match any term, case-insensitively
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  return text.replace(
    pattern,
    `${MATCH_HIGHLIGHT_START}$1${MATCH_HIGHLIGHT_END}`,
  );
}
