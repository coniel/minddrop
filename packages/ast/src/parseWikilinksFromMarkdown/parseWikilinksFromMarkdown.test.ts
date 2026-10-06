import { describe, expect, it } from 'vitest';
import { parseWikilinksFromMarkdown } from './parseWikilinksFromMarkdown';

describe('parseWikilinksFromMarkdown', () => {
  it('parses the reference of each link', () => {
    expect(
      parseWikilinksFromMarkdown('See [[Book]] and [[Books/Other book]].'),
    ).toEqual([{ reference: 'Book' }, { reference: 'Books/Other book' }]);
  });

  it('parses the fragment of a link', () => {
    expect(parseWikilinksFromMarkdown('[[Book#^abcd1234|quote]]')).toEqual([
      { reference: 'Book', fragment: '^abcd1234' },
    ]);
  });

  it('parses links on every line', () => {
    expect(
      parseWikilinksFromMarkdown('# [[Book]]\n\n- [[Other book]]'),
    ).toEqual([{ reference: 'Book' }, { reference: 'Other book' }]);
  });

  it('returns every occurrence of a repeated link', () => {
    expect(parseWikilinksFromMarkdown('[[Book]] [[Book]]')).toEqual([
      { reference: 'Book' },
      { reference: 'Book' },
    ]);
  });

  it('ignores links inside a fenced code block', () => {
    expect(
      parseWikilinksFromMarkdown('```md\n[[Book]]\n```\n[[Other book]]'),
    ).toEqual([{ reference: 'Other book' }]);
  });

  it('ignores links inside an inline code span', () => {
    expect(
      parseWikilinksFromMarkdown('Write `[[Book]]` to link [[Other book]].'),
    ).toEqual([{ reference: 'Other book' }]);
  });

  it('does not join text around a code span into a link', () => {
    expect(parseWikilinksFromMarkdown('[[Book`code`]]')).toEqual([]);
  });
});
