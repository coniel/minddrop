import { describe, expect, it } from 'vitest';
import { parseInlineMarkdown } from './parseInlineMarkdown';

const textWithMarks = '_Hello_, **world**!';
const textWithLink = 'Hello, [world](https://example.com)!';
const textWithCode = 'Hello, `world`!';
const textWithNestedFormatting = '_~Hello~, **[world](https://example.com)**!_';

describe('parseInlineMarkdown', () => {
  it('parses basic marks from text', () => {
    const result = parseInlineMarkdown(textWithMarks);

    expect(result).toEqual([
      { text: 'Hello', italic: true, italicSyntax: '_' },
      { text: ', ' },
      { text: 'world', bold: true, boldSyntax: '**' },
      { text: '!' },
    ]);
  });

  it('parses links from text', () => {
    const result = parseInlineMarkdown(textWithLink);

    expect(result).toEqual([
      { text: 'Hello, ' },
      {
        type: 'link',
        href: 'https://example.com',
        title: null,
        children: [{ text: 'world' }],
      },
      { text: '!' },
    ]);
  });

  it('parses code from text', () => {
    const result = parseInlineMarkdown(textWithCode);

    expect(result).toEqual([
      { text: 'Hello, ' },
      { text: 'world', code: true, codeSyntax: '`' },
      { text: '!' },
    ]);
  });

  it('parses strikethrough from text', () => {
    const resultSingle = parseInlineMarkdown('~Hello~');
    const resultDouble = parseInlineMarkdown('~~Hello~~');

    expect(resultSingle).toEqual([
      {
        text: 'Hello',
        strikethrough: true,
        strikethroughSyntax: '~',
      },
    ]);

    expect(resultDouble).toEqual([
      {
        text: 'Hello',
        strikethrough: true,
        strikethroughSyntax: '~~',
      },
    ]);
  });

  it('parses nested formatting from text', () => {
    const result = parseInlineMarkdown(textWithNestedFormatting);

    expect(result).toEqual([
      {
        text: 'Hello',
        italic: true,
        italicSyntax: '_',
        strikethrough: true,
        strikethroughSyntax: '~',
      },
      { text: ', ', italic: true, italicSyntax: '_' },
      {
        type: 'link',
        href: 'https://example.com',
        title: null,
        children: [
          {
            text: 'world',
            bold: true,
            boldSyntax: '**',
            italic: true,
            italicSyntax: '_',
          },
        ],
      },
      { text: '!', italic: true, italicSyntax: '_' },
    ]);
  });
});
