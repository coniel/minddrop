import { describe, expect, it } from 'vitest';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../../constants';
import { highlightAllMatches } from './highlightAllMatches';

// Wraps text in the highlight markers for expected values
function marked(text: string): string {
  return `${MATCH_HIGHLIGHT_START}${text}${MATCH_HIGHLIGHT_END}`;
}

describe('highlightAllMatches', () => {
  it('returns the text unchanged when there are no terms', () => {
    expect(highlightAllMatches('Some text', [])).toBe('Some text');
  });

  it('wraps a matching term in highlight markers', () => {
    expect(highlightAllMatches('The quick fox', ['quick'])).toBe(
      `The ${marked('quick')} fox`,
    );
  });

  it('matches case-insensitively, preserving the original case', () => {
    expect(highlightAllMatches('Quick fox', ['quick'])).toBe(
      `${marked('Quick')} fox`,
    );
  });

  it('wraps all occurrences of all terms', () => {
    expect(highlightAllMatches('red fish blue fish', ['fish', 'blue'])).toBe(
      `red ${marked('fish')} ${marked('blue')} ${marked('fish')}`,
    );
  });

  it('prefers the longer term when terms overlap', () => {
    expect(highlightAllMatches('bookshop', ['book', 'bookshop'])).toBe(
      marked('bookshop'),
    );
  });

  it('escapes regex special characters in terms', () => {
    expect(highlightAllMatches('cost: $5 (net)', ['$5', '(net)'])).toBe(
      `cost: ${marked('$5')} ${marked('(net)')}`,
    );
  });

  it('matches terms mid-word', () => {
    expect(highlightAllMatches('rebuild', ['build'])).toBe(
      `re${marked('build')}`,
    );
  });
});
