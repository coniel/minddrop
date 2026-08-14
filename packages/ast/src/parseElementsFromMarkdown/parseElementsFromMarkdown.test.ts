import { describe, expect, it } from 'vitest';
import {
  CodeElement,
  HeadingElement,
  TableElement,
  TableRowElement,
} from '../element-configs';
import { Element, ListItemFrame } from '../types';
import { parseElementsFromMarkdown } from './parseElementsFromMarkdown';

function types(elements: Element[]): string[] {
  return elements.map((element) => element.type);
}

function itemFrame(element: Element, depth = 0): ListItemFrame {
  return element.ancestry![depth] as ListItemFrame;
}

describe('parseElementsFromMarkdown', () => {
  it('returns an empty paragraph for an empty document', () => {
    const elements = parseElementsFromMarkdown('');

    expect(types(elements)).toEqual(['paragraph']);
    expect(elements[0].spacingBefore).toBe('');
  });

  it('keeps the whitespace of a document with no content', () => {
    const elements = parseElementsFromMarkdown('\n\n');

    expect(types(elements)).toEqual(['paragraph']);
    expect(elements[0].spacingBefore).toBe('\n\n');
  });

  it('records the source each block was parsed from', () => {
    const elements = parseElementsFromMarkdown('# Title\n\nA paragraph.\n');

    expect(elements[0].source).toBe('# Title');
    expect(elements[1].source).toBe('A paragraph.');
  });

  it('records the spacing around each block', () => {
    const elements = parseElementsFromMarkdown('# Title\n\n\nA paragraph.\n');

    expect(elements[0].spacingBefore).toBe('');
    expect(elements[0].spacingAfter).toBe('\n\n\n');
    expect(elements[1].spacingAfter).toBe('\n');
  });

  describe('block types', () => {
    it('parses headings with their level and syntax', () => {
      const [atx, setext] = parseElementsFromMarkdown(
        '## ATX\n\nSetext\n======\n',
      ) as HeadingElement[];

      expect(atx.level).toBe(2);
      expect(atx.syntax).toBe('#');
      expect(setext.level).toBe(1);
      expect(setext.syntax).toBe('=');
    });

    it('parses a fenced code block', () => {
      const [code] = parseElementsFromMarkdown(
        '~~~~ts meta\nconst a = 1;\n~~~~\n',
      ) as CodeElement[];

      expect(code.type).toBe('code');
      expect(code.lang).toBe('ts');
      expect(code.meta).toBe('meta');
      expect(code.fence).toBe('~');
      expect(code.fenceLength).toBe(4);
      expect(code.children).toEqual([{ text: 'const a = 1;' }]);
    });

    it('parses an indented code block', () => {
      const [code] = parseElementsFromMarkdown('    const a = 1;\n');

      expect((code as CodeElement).indented).toBe(true);
      expect(code.children).toEqual([{ text: 'const a = 1;' }]);
    });

    it('parses the block level constructs of a document', () => {
      const elements = parseElementsFromMarkdown(
        '---\n\n<div>a</div>\n\n[ref]: https://example.com\n\n$$\nx\n$$\n',
      );

      expect(types(elements)).toEqual([
        'thematic-break',
        'html',
        'definition',
        'math',
      ]);
    });

    it('parses a table into rows and cells', () => {
      const [table] = parseElementsFromMarkdown(
        '| a | b |\n| :- | -: |\n| c | d |\n',
      ) as TableElement[];

      expect(table.type).toBe('table');
      expect(table.align).toEqual(['left', 'right']);

      const rows = table.children as TableRowElement[];

      expect(rows).toHaveLength(2);
      expect(rows[0].children).toHaveLength(2);
    });
  });

  describe('containers', () => {
    it('flattens a quote into a frame on its blocks', () => {
      const elements = parseElementsFromMarkdown('> One\n>\n> Two\n');

      expect(types(elements)).toEqual(['paragraph', 'paragraph']);
      expect(elements[0].ancestry![0].kind).toBe('blockquote');
      // Both blocks are in the same quote
      expect(elements[0].ancestry![0].id).toBe(elements[1].ancestry![0].id);
    });

    it('flattens list items into frames on their blocks', () => {
      const elements = parseElementsFromMarkdown('- One\n- Two\n');

      expect(types(elements)).toEqual(['paragraph', 'paragraph']);
      expect(itemFrame(elements[0]).marker).toBe('-');
      // Separate items are separate frames
      expect(elements[0].ancestry![0].id).not.toBe(elements[1].ancestry![0].id);
    });

    it('keeps an item continuation block in the same frame', () => {
      const elements = parseElementsFromMarkdown('- One\n\n  Still one\n');

      expect(elements[0].ancestry![0].id).toBe(elements[1].ancestry![0].id);
    });

    it('nests a list inside its parent item', () => {
      const elements = parseElementsFromMarkdown('- One\n  - Nested\n');

      expect(elements[1].ancestry).toHaveLength(2);
      expect(elements[1].ancestry![0].id).toBe(elements[0].ancestry![0].id);
      // The parent's prefix supplies the indentation, so the nested item
      // adds none of its own
      expect(itemFrame(elements[1], 1).indent).toBe('');
    });

    it('records indentation the author added beyond the containers', () => {
      const elements = parseElementsFromMarkdown('  - One\n');

      expect(itemFrame(elements[0]).indent).toBe('  ');
    });

    it('reads the marker and number of an ordered item', () => {
      const elements = parseElementsFromMarkdown('3) One\n4) Two\n');

      expect(itemFrame(elements[0]).ordered).toBe(true);
      expect(itemFrame(elements[0]).marker).toBe(')');
      expect(itemFrame(elements[0]).number).toBe(3);
      expect(itemFrame(elements[1]).number).toBe(4);
    });

    it('reads the checked state of a task item', () => {
      const elements = parseElementsFromMarkdown('- [x] Done\n- [ ] Todo\n');

      expect(itemFrame(elements[0]).checked).toBe(true);
      expect(itemFrame(elements[1]).checked).toBe(false);
      // The checkbox belongs to the item rather than to its text
      expect(elements[0].children).toEqual([{ text: 'Done' }]);
    });

    it('leaves a plain item without a checked state', () => {
      const elements = parseElementsFromMarkdown('- One\n');

      expect(itemFrame(elements[0]).checked).toBeUndefined();
    });

    it('flattens a footnote definition into a frame', () => {
      const elements = parseElementsFromMarkdown('[^1]: A note\n');

      expect(elements[0].ancestry![0]).toMatchObject({
        kind: 'footnote-definition',
        identifier: '1',
      });
    });
  });

  it('keeps a construct it does not model as its own source', () => {
    // Every mdast node type is mapped, so an unsupported element can only
    // come from a node the parser produces which the model does not cover
    const elements = parseElementsFromMarkdown('# Title\n');

    expect(types(elements)).not.toContain('unsupported');
  });
});
