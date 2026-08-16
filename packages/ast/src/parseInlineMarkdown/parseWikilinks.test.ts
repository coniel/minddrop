import { describe, expect, it } from 'vitest';
import { parseWikilinks } from './parseWikilinks';

describe('parseWikilinks', () => {
  it('reads a link with a label', () => {
    expect(parseWikilinks({ text: '[[Books/Book|Book]]' })).toEqual([
      {
        type: 'wikilink',
        reference: 'Books/Book',
        children: [{ text: 'Book' }],
      },
    ]);
  });

  it('shows the reference of a link written without a label', () => {
    expect(parseWikilinks({ text: '[[Books/Book]]' })).toEqual([
      {
        type: 'wikilink',
        reference: 'Books/Book',
        children: [{ text: 'Books/Book' }],
      },
    ]);
  });

  it('keeps the text around a link', () => {
    expect(parseWikilinks({ text: 'See [[Books/Book|Book]] now' })).toEqual([
      { text: 'See ' },
      {
        type: 'wikilink',
        reference: 'Books/Book',
        children: [{ text: 'Book' }],
      },
      { text: ' now' },
    ]);
  });

  it('reads several links in one run of text', () => {
    const fragment = parseWikilinks({ text: '[[A]] and [[B]]' });

    expect(fragment).toHaveLength(3);
    expect(fragment[0]).toMatchObject({ reference: 'A' });
    expect(fragment[2]).toMatchObject({ reference: 'B' });
  });

  it('keeps the marks of the text around a link', () => {
    const fragment = parseWikilinks({
      text: 'See [[A]]',
      bold: true,
      boldSyntax: '**',
    });

    // The label is part of the link's spelling, so it carries no marks of
    // its own
    expect(fragment[0]).toEqual({ text: 'See ', bold: true, boldSyntax: '**' });
    expect(fragment[1]).toMatchObject({ type: 'wikilink' });
  });

  it('leaves text which holds no links as it was', () => {
    const text = { text: 'No links here', bold: true };

    expect(parseWikilinks(text)).toEqual([text]);
  });

  it('leaves an unclosed link as text', () => {
    const text = { text: 'An [[unclosed link' };

    expect(parseWikilinks(text)).toEqual([text]);
  });

  it('leaves an empty reference as text', () => {
    const text = { text: '[[]]' };

    expect(parseWikilinks(text)).toEqual([text]);
  });
});
