import { describe, expect, it } from 'vitest';
import { LinkElement } from '../element-configs';
import { parseElementsFromMarkdown } from '../parseElementsFromMarkdown';
import { Fragment } from '../types';

// The inline mapping reads mdast nodes and their source offsets, so it is
// exercised through the document parser rather than on its own
function parseInline(markdown: string): Fragment {
  return parseElementsFromMarkdown(markdown)[0].children;
}

describe('parseInlineMarkdown', () => {
  it('parses plain text', () => {
    expect(parseInline('Hello world')).toEqual([{ text: 'Hello world' }]);
  });

  it('returns an empty leaf for an empty block', () => {
    expect(parseInline('')).toEqual([{ text: '' }]);
  });

  describe('marks', () => {
    it('preserves the delimiter bold was written with', () => {
      expect(parseInline('**a**')).toEqual([
        { text: 'a', bold: true, boldSyntax: '**' },
      ]);
      expect(parseInline('__a__')).toEqual([
        { text: 'a', bold: true, boldSyntax: '__' },
      ]);
    });

    it('preserves the delimiter emphasis was written with', () => {
      expect(parseInline('*a*')).toEqual([
        { text: 'a', italic: true, italicSyntax: '*' },
      ]);
      expect(parseInline('_a_')).toEqual([
        { text: 'a', italic: true, italicSyntax: '_' },
      ]);
    });

    it('preserves the length of a strikethrough delimiter', () => {
      expect(parseInline('~~a~~')).toEqual([
        { text: 'a', strikethrough: true, strikethroughSyntax: '~~' },
      ]);
      expect(parseInline('~a~')).toEqual([
        { text: 'a', strikethrough: true, strikethroughSyntax: '~' },
      ]);
    });

    it('preserves the length of a code span fence', () => {
      expect(parseInline('`a`')).toEqual([
        { text: 'a', code: true, codeSyntax: '`' },
      ]);
      expect(parseInline('``a`b``')).toEqual([
        { text: 'a`b', code: true, codeSyntax: '``' },
      ]);
    });

    it('carries marks through nested formatting', () => {
      expect(parseInline('**a _b_**')).toEqual([
        { text: 'a ', bold: true, boldSyntax: '**' },
        {
          text: 'b',
          bold: true,
          boldSyntax: '**',
          italic: true,
          italicSyntax: '_',
        },
      ]);
    });
  });

  describe('inline elements', () => {
    it('parses a link', () => {
      const [link] = parseInline('[text](https://example.com "Title")') as [
        LinkElement,
      ];

      expect(link.type).toBe('link');
      expect(link.url).toBe('https://example.com');
      expect(link.title).toBe('Title');
      expect(link.children).toEqual([{ text: 'text' }]);
    });

    it('marks an autolink as one', () => {
      const [link] = parseInline('<https://example.com>') as [LinkElement];

      expect(link.autolink).toBe(true);
    });

    it('does not mark an inline link as an autolink', () => {
      const [link] = parseInline('[a](https://example.com)') as [LinkElement];

      expect(link.autolink).toBeUndefined();
    });

    it('parses references, images, footnotes and math', () => {
      // A reference only parses as one when its definition is present
      const definition = '\n\n[ref]: https://example.com\n';

      expect(parseInline(`[a][ref]${definition}`)[0]).toMatchObject({
        type: 'link-reference',
        identifier: 'ref',
        referenceType: 'full',
      });
      expect(parseInline('![alt](cat.png)')[0]).toMatchObject({
        type: 'image',
        url: 'cat.png',
        alt: 'alt',
      });
      expect(parseInline(`![alt][ref]${definition}`)[0]).toMatchObject({
        type: 'image-reference',
        identifier: 'ref',
      });
      expect(parseInline('a[^1]\n\n[^1]: A note\n')[1]).toMatchObject({
        type: 'footnote-reference',
        identifier: '1',
      });
      expect(parseInline('$x$')[0]).toMatchObject({
        type: 'inline-math',
        value: 'x',
      });
      expect(parseInline('a <span>b</span>')[1]).toMatchObject({
        type: 'inline-html',
        value: '<span>',
      });
    });

    it('preserves the spelling of a hard line break', () => {
      expect(parseInline('a  \nb')[1]).toMatchObject({
        type: 'break',
        syntax: '  ',
      });
      expect(parseInline('a\\\nb')[1]).toMatchObject({
        type: 'break',
        syntax: '\\',
      });
    });
  });
});
