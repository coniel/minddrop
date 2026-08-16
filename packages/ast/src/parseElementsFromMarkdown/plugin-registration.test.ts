import { describe, expect, it } from 'vitest';
import { parseElementsFromMarkdown } from './parseElementsFromMarkdown';

/**
 * A plugin which fails to register is otherwise invisible: unified treats a
 * value it cannot use as an empty preset rather than throwing, and a block
 * parsed as a paragraph still round-trips byte for byte from its source. So
 * every construct which needs a plugin is asserted to parse into the element
 * it is, rather than merely to survive.
 */
describe('remark plugin registration', () => {
  it('parses a math block as math', () => {
    const elements = parseElementsFromMarkdown('$$\na^2\n$$\n');

    expect(elements.map((element) => element.type)).toEqual(['math']);
  });

  it('parses inline math as inline math', () => {
    const elements = parseElementsFromMarkdown('An $a^2$ expression.\n');

    expect(
      elements[0].children.map((child) =>
        'type' in child ? child.type : 'text',
      ),
    ).toContain('inline-math');
  });

  it('parses a GFM table as a table', () => {
    const elements = parseElementsFromMarkdown(
      '| a | b |\n|---|---|\n| 1 | 2 |\n',
    );

    expect(elements.map((element) => element.type)).toEqual(['table']);
  });

  it('parses a GFM task item as a checked list item', () => {
    const elements = parseElementsFromMarkdown('- [x] done\n');

    expect(elements[0].ancestry?.[0]).toMatchObject({ checked: true });
  });

  it('parses GFM strikethrough as a mark', () => {
    const elements = parseElementsFromMarkdown('~~gone~~\n');

    expect(elements[0].children[0]).toMatchObject({ strikethrough: true });
  });
});
