import { describe, expect, it } from 'vitest';
import { WikilinkPattern } from '../../constants';
import { parseWikilinkMatch } from './parseWikilinkMatch';

/**
 * Matches the first wikilink in a text.
 *
 * @param text - The text containing a wikilink.
 * @returns The match.
 */
function matchWikilink(text: string): RegExpMatchArray {
  return [...text.matchAll(WikilinkPattern)][0];
}

describe('parseWikilinkMatch', () => {
  it("parses a link's reference, fragment and label", () => {
    expect(parseWikilinkMatch(matchWikilink('[[Book#^abcd|quote]]'))).toEqual({
      reference: 'Book',
      fragment: '^abcd',
      label: 'quote',
    });
  });

  it('parses a link written as its reference alone', () => {
    expect(parseWikilinkMatch(matchWikilink('[[Books/Book]]'))).toEqual({
      reference: 'Books/Book',
    });
  });

  it('parses no label from a link with an empty one', () => {
    expect(
      parseWikilinkMatch(matchWikilink('[[Book|]]')).label,
    ).toBeUndefined();
  });
});
