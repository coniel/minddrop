import { describe, expect, it } from 'vitest';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../../constants';
import { extractSnippet } from './extractSnippet';

// Wraps text in the highlight markers for expected values
function marked(text: string): string {
  return `${MATCH_HIGHLIGHT_START}${text}${MATCH_HIGHLIGHT_END}`;
}

describe('extractSnippet', () => {
  it('returns the text unchanged when no term matches', () => {
    expect(extractSnippet('The quick brown fox', ['zebra'])).toBe(
      'The quick brown fox',
    );
  });

  it('highlights the match in a short text without truncating', () => {
    expect(extractSnippet('The quick brown fox', ['quick'])).toBe(
      `The ${marked('quick')} brown fox`,
    );
  });

  it('extracts a window of context words around the match', () => {
    const text =
      'one two three four five six seven eight nine ten eleven twelve thirteen';

    // The match on "seven" keeps five words on each side
    expect(extractSnippet(text, ['seven'])).toBe(
      `two three four five six ${marked('seven')} eight nine ten eleven twelve`,
    );
  });

  it('clamps the window at the start of the text', () => {
    const text = 'one two three four five six seven eight';

    expect(extractSnippet(text, ['two'])).toBe(
      `one ${marked('two')} three four five six seven`,
    );
  });

  it('clamps the window at the end of the text', () => {
    const text = 'one two three four five six seven eight';

    expect(extractSnippet(text, ['seven'])).toBe(
      `two three four five six ${marked('seven')} eight`,
    );
  });

  it('centres on the earliest matching term', () => {
    const text = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';

    // "beta" occurs before "theta", so the window centres on it,
    // leaving "theta" outside the snippet
    expect(extractSnippet(text, ['theta', 'beta'])).toBe(
      `alpha ${marked('beta')} gamma delta epsilon zeta eta`,
    );
  });

  it('highlights every matching term within the snippet', () => {
    const text = 'red fish blue fish green fish';

    expect(extractSnippet(text, ['fish'])).toBe(
      `red ${marked('fish')} blue ${marked('fish')} green ${marked('fish')}`,
    );
  });

  it('matches case-insensitively', () => {
    expect(extractSnippet('The Quick brown fox', ['quick'])).toBe(
      `The ${marked('Quick')} brown fox`,
    );
  });
});
