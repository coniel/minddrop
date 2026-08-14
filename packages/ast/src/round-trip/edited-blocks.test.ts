import { describe, expect, it } from 'vitest';
import * as Ast from '../Ast';
import { Element } from '../types';

/**
 * Simulates the editor touching a block, which drops the source it was
 * parsed from and leaves it to be rebuilt from its own data.
 */
function edit(element: Element, children?: Element['children']): Element {
  return {
    ...element,
    source: undefined,
    ...(children ? { children } : {}),
  };
}

describe('edited blocks', () => {
  it('rebuilds only the edited block, leaving the rest byte identical', () => {
    const source = [
      '# Title',
      '',
      '```ts',
      'const a = 1;',
      '```',
      '',
      'A paragraph with __bold__ text.',
      '',
      '| a | b |',
      '| --- | --- |',
      '| c | d |',
      '',
    ].join('\n');

    const elements = Ast.fromMarkdown(source);
    const edited = elements.map((element, index) =>
      index === 0 ? edit(element, [{ text: 'Edited title' }]) : element,
    );

    // The heading is rebuilt, and everything the user did not touch comes
    // back exactly as it was written
    expect(Ast.toMarkdown(edited)).toBe(
      source.replace('# Title', '# Edited title'),
    );
  });

  it('keeps the delimiter a mark was written with when its block is edited', () => {
    const source = 'A paragraph with __bold__ and _italic_ text.\n';
    const [paragraph] = Ast.fromMarkdown(source);

    expect(Ast.toMarkdown([edit(paragraph)])).toBe(source);
  });

  it('keeps a code block fenced as it was written when it is edited', () => {
    const source = '~~~~ts meta\nconst a = 1;\n~~~~\n';
    const [code] = Ast.fromMarkdown(source);

    expect(Ast.toMarkdown([edit(code)])).toBe(source);
  });

  it('keeps a setext heading when it is edited', () => {
    const source = 'Title\n=====\n';
    const [heading] = Ast.fromMarkdown(source);

    // The underline is rebuilt to match the text rather than kept at its
    // original length, which is the one thing an edit cannot preserve
    expect(Ast.toMarkdown([edit(heading)])).toBe(source);
  });

  it('keeps a list item marker and task box when its block is edited', () => {
    const source = '* [X] A task\n';
    const [item] = Ast.fromMarkdown(source);

    expect(Ast.toMarkdown([edit(item)])).toBe(source);
  });

  it('keeps an autolink when its block is edited', () => {
    const source = 'See <https://example.com> for more.\n';
    const [paragraph] = Ast.fromMarkdown(source);

    expect(Ast.toMarkdown([edit(paragraph)])).toBe(source);
  });

  it('never drops a block which has no source and no config', () => {
    const elements = [
      { type: 'made-up', children: [{ text: 'content' }] } as Element,
    ];

    expect(() => Ast.toMarkdown(elements)).toThrow();
  });
});
