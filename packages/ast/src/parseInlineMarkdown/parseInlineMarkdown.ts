import { Token, marked } from 'marked';
import { Element, TextElement } from '../types';

/**
 * Parses inline markdown into a list of inline AST elements.
 *
 * @param text - The markdown text to parse.
 * @returns A list of Slate nodes.
 */
export function parseInlineMarkdown(text: string): (TextElement | Element)[] {
  const lexer = new marked.Lexer({ gfm: true });
  const tokens = lexer.inlineTokens(text);

  if (text === '') {
    return [{ text: '' }];
  }

  return transformTokens(tokens);
}

function transformTokens(
  tokens: Token[],
  marks: Partial<TextElement> = {},
): (TextElement | Element)[] {
  const slateNodes: (TextElement | Element)[] = [];

  tokens.forEach((token) => {
    if (token.type === 'text') {
      slateNodes.push({ text: token.text || '', ...marks });
    } else if (token.type === 'em') {
      slateNodes.push(
        ...transformTokens(token.tokens || [], {
          ...marks,
          italic: true,
          italicSyntax: token.raw[0],
        }),
      );
    } else if (token.type === 'strong') {
      slateNodes.push(
        ...transformTokens(token.tokens || [], {
          ...marks,
          bold: true,
          boldSyntax: token.raw.slice(0, 2),
        }),
      );
    } else if (token.type === 'del') {
      const syntaxLength = token.raw.startsWith('~~') ? 2 : 1;

      slateNodes.push(
        ...transformTokens(token.tokens || [], {
          ...marks,
          strikethrough: true,
          strikethroughSyntax: token.raw.slice(0, syntaxLength),
        }),
      );
    } else if (token.type === 'codespan') {
      slateNodes.push({
        text: token.text || '',
        code: true,
        codeSyntax: token.raw[0],
        ...marks,
      });
    } else if (token.type === 'link') {
      const children = transformTokens(token.tokens || [], marks);

      slateNodes.push({
        type: 'link',
        href: token.href!,
        title: token.title,
        children,
      } as Element);
    } else {
      slateNodes.push({ text: token.raw || '', ...marks });
    }
  });

  return slateNodes;
}
