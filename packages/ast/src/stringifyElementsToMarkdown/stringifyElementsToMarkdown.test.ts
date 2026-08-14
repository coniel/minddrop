import { describe, expect, it } from 'vitest';
import { HeadingElement, ParagraphElement } from '../element-configs';
import { SerializationError } from '../errors';
import {
  BlockquoteFrame,
  Element,
  FootnoteDefinitionFrame,
  Frame,
  ListItemFrame,
} from '../types';
import { generateElement } from '../utils';
import { stringifyElementsToMarkdown } from './stringifyElementsToMarkdown';

function generateListItemFrame(
  id: string,
  data: Partial<ListItemFrame> = {},
): ListItemFrame {
  return {
    id,
    kind: 'list-item',
    ordered: false,
    marker: '-',
    ...data,
  };
}

function generateBlockquoteFrame(id: string): BlockquoteFrame {
  return { id, kind: 'blockquote' };
}

function generateParagraph(text: string, ancestry?: Frame[]): ParagraphElement {
  return generateElement<ParagraphElement>('paragraph', {
    ancestry,
    children: [{ text }],
  });
}

describe('stringifyElementsToMarkdown', () => {
  it('separates root level blocks by a blank line', () => {
    const elements = [generateParagraph('One'), generateParagraph('Two')];

    expect(stringifyElementsToMarkdown(elements)).toBe('One\n\nTwo');
  });

  it('throws when a block has no element type config', () => {
    const elements: Element[] = [generateElement('unconfigured')];

    expect(() => stringifyElementsToMarkdown(elements)).toThrow(
      SerializationError,
    );
  });

  it('stringifies headings', () => {
    const elements = [
      generateElement<HeadingElement>('heading', {
        level: 2,
        children: [{ text: 'Title' }],
      }),
    ];

    expect(stringifyElementsToMarkdown(elements)).toBe('## Title');
  });

  describe('list items', () => {
    it('stringifies a tight list', () => {
      const elements = [
        generateParagraph('One', [generateListItemFrame('item-1')]),
        generateParagraph('Two', [generateListItemFrame('item-2')]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('- One\n- Two');
    });

    it('separates the items of a loose list by a blank line', () => {
      const elements = [
        generateParagraph('One', [
          generateListItemFrame('item-1', { spread: true }),
        ]),
        generateParagraph('Two', [
          generateListItemFrame('item-2', { spread: true }),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('- One\n\n- Two');
    });

    it('preserves the bullet character', () => {
      const elements = [
        generateParagraph('One', [
          generateListItemFrame('item-1', { marker: '*' }),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('* One');
    });

    it('indents an item continuation block without repeating the marker', () => {
      const item = generateListItemFrame('item-1', { spread: true });
      const elements = [
        generateParagraph('One', [item]),
        generateParagraph('Still one', [item]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '- One\n\n  Still one',
      );
    });

    it('indents a nested item by its parent', () => {
      const parent = generateListItemFrame('item-1');
      const elements = [
        generateParagraph('One', [parent]),
        generateParagraph('Nested', [parent, generateListItemFrame('item-2')]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('- One\n  - Nested');
    });

    it('keeps adjacent items with the same marker in one list', () => {
      const elements = [
        generateParagraph('One', [generateListItemFrame('item-1')]),
        generateParagraph('Two', [generateListItemFrame('item-2')]),
      ];

      // Markdown has no way to express two adjacent lists sharing a
      // marker, so the items stay tight rather than being split by a
      // blank line which would turn the list loose
      expect(stringifyElementsToMarkdown(elements)).toBe('- One\n- Two');
    });

    it('separates lists with different markers by a blank line', () => {
      const elements = [
        generateParagraph('One', [generateListItemFrame('item-1')]),
        generateParagraph('Two', [
          generateListItemFrame('item-2', { marker: '*' }),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('- One\n\n* Two');
    });

    it('stringifies task items', () => {
      const elements = [
        generateParagraph('Done', [
          generateListItemFrame('item-1', { checked: true }),
        ]),
        generateParagraph('Todo', [
          generateListItemFrame('item-2', { checked: false }),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '- [x] Done\n- [ ] Todo',
      );
    });
  });

  describe('ordered list numbering', () => {
    function generateOrderedItem(
      id: string,
      number: number,
      marker = '.',
    ): ListItemFrame {
      return generateListItemFrame(id, {
        ordered: true,
        marker,
        number,
      });
    }

    it('numbers items sequentially regardless of the authored numbers', () => {
      const elements = [
        generateParagraph('One', [generateOrderedItem('item-1', 1)]),
        generateParagraph('Two', [generateOrderedItem('item-2', 1)]),
        generateParagraph('Three', [generateOrderedItem('item-3', 1)]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '1. One\n2. Two\n3. Three',
      );
    });

    it('starts from the first item of the list', () => {
      const elements = [
        generateParagraph('Three', [generateOrderedItem('item-1', 3)]),
        generateParagraph('Four', [generateOrderedItem('item-2', 9)]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('3. Three\n4. Four');
    });

    it('restarts numbering for a separate list', () => {
      const elements = [
        generateParagraph('One', [generateOrderedItem('item-1', 1)]),
        generateParagraph('Two', [generateOrderedItem('item-2', 1)]),
        generateParagraph('Break'),
        generateParagraph('One again', [generateOrderedItem('item-3', 1)]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '1. One\n2. Two\n\nBreak\n\n1. One again',
      );
    });

    it('restarts numbering when the delimiter changes', () => {
      const elements = [
        generateParagraph('One', [generateOrderedItem('item-1', 1)]),
        generateParagraph('Two', [generateOrderedItem('item-2', 1)]),
        generateParagraph('One again', [generateOrderedItem('item-3', 1, ')')]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '1. One\n2. Two\n\n1) One again',
      );
    });

    it('numbers a nested list independently of its parent', () => {
      const parent = generateOrderedItem('item-1', 1);
      const elements = [
        generateParagraph('One', [parent]),
        generateParagraph('Nested one', [
          parent,
          generateOrderedItem('nested-1', 1),
        ]),
        generateParagraph('Nested two', [
          parent,
          generateOrderedItem('nested-2', 1),
        ]),
        generateParagraph('Two', [generateOrderedItem('item-2', 1)]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '1. One\n   1. Nested one\n   2. Nested two\n2. Two',
      );
    });

    it('does not advance the list for an item continuation block', () => {
      const item = generateOrderedItem('item-1', 1);
      const elements = [
        generateParagraph('One', [item]),
        generateParagraph('Still one', [item]),
        generateParagraph('Two', [generateOrderedItem('item-2', 1)]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '1. One\n   Still one\n2. Two',
      );
    });

    it('preserves the delimiter character', () => {
      const elements = [
        generateParagraph('One', [
          generateListItemFrame('item-1', {
            ordered: true,
            marker: ')',
            number: 1,
          }),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('1) One');
    });
  });

  describe('block quotes', () => {
    it('prefixes every line of a quoted block', () => {
      const elements = [
        generateParagraph('Quoted', [generateBlockquoteFrame('quote-1')]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('> Quoted');
    });

    it('prefixes the blank line between two quoted blocks', () => {
      const quote = generateBlockquoteFrame('quote-1');
      const elements = [
        generateParagraph('One', [quote]),
        generateParagraph('Two', [quote]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('> One\n>\n> Two');
    });

    it('preserves the quote syntax', () => {
      const elements = [
        generateParagraph('Quoted', [
          { id: 'quote-1', kind: 'blockquote', syntax: '>' },
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('>Quoted');
    });

    it('composes a quoted list item prefix', () => {
      const elements = [
        generateParagraph('Item', [
          generateBlockquoteFrame('quote-1'),
          generateListItemFrame('item-1'),
        ]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe('> - Item');
    });
  });

  describe('footnote definitions', () => {
    const footnote: FootnoteDefinitionFrame = {
      id: 'footnote-1',
      kind: 'footnote-definition',
      identifier: '1',
    };

    it('opens the definition with its label', () => {
      const elements = [generateParagraph('A note', [footnote])];

      expect(stringifyElementsToMarkdown(elements)).toBe('[^1]: A note');
    });

    it('indents continuation blocks', () => {
      const elements = [
        generateParagraph('A note', [footnote]),
        generateParagraph('More', [footnote]),
      ];

      expect(stringifyElementsToMarkdown(elements)).toBe(
        '[^1]: A note\n\n    More',
      );
    });
  });
});
