import { describe, expect, it } from 'vitest';
import {
  BlockquoteFrame,
  FootnoteDefinitionFrame,
  ListItemFrame,
} from '../../types';
import { resolveAncestryPrefixes } from './resolveAncestryPrefixes';

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

function generateBlockquoteFrame(
  id: string,
  data: Partial<BlockquoteFrame> = {},
): BlockquoteFrame {
  return { id, kind: 'blockquote', ...data };
}

function generateFootnoteDefinitionFrame(
  id: string,
  data: Partial<FootnoteDefinitionFrame> = {},
): FootnoteDefinitionFrame {
  return { id, kind: 'footnote-definition', identifier: 'note', ...data };
}

describe('resolveAncestryPrefixes', () => {
  it('returns empty prefixes for a root level block', () => {
    expect(resolveAncestryPrefixes()).toEqual({ first: '', continuation: '' });
  });

  describe('blockquotes', () => {
    it('marks both prefixes with the quote marker', () => {
      const ancestry = [generateBlockquoteFrame('quote-1')];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '> ',
        continuation: '> ',
      });
    });

    it('preserves the authored quote syntax', () => {
      const ancestry = [generateBlockquoteFrame('quote-1', { syntax: '>' })];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '>',
        continuation: '>',
      });
    });
  });

  describe('footnote definitions', () => {
    it('opens the definition with its label and indents its content', () => {
      const ancestry = [generateFootnoteDefinitionFrame('footnote-1')];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '[^note]: ',
        continuation: '    ',
      });
    });

    it('prefers the label as authored over the identifier', () => {
      const ancestry = [
        generateFootnoteDefinitionFrame('footnote-1', { label: 'Note' }),
      ];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '[^Note]: ',
        continuation: '    ',
      });
    });
  });

  describe('list items', () => {
    it('marks the first line and aligns continuation lines with the content', () => {
      const ancestry = [generateListItemFrame('item-1')];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '- ',
        continuation: '  ',
      });
    });

    it('includes the item indent in both prefixes', () => {
      const ancestry = [generateListItemFrame('item-1', { indent: '  ' })];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '  - ',
        continuation: '    ',
      });
    });

    it('prefers the number as authored on an ordered item', () => {
      const ancestry = [
        generateListItemFrame('item-1', {
          ordered: true,
          marker: '.',
          number: 5,
        }),
      ];
      // The computed number would draw the item differently
      const numbers = new Map([['item-1', 2]]);

      expect(resolveAncestryPrefixes(ancestry, [], numbers)).toEqual({
        first: '5. ',
        continuation: '   ',
      });
    });

    it('falls back to the computed number on an unauthored ordered item', () => {
      const ancestry = [
        generateListItemFrame('item-1', { ordered: true, marker: '.' }),
      ];
      const numbers = new Map([['item-1', 3]]);

      expect(resolveAncestryPrefixes(ancestry, [], numbers)).toEqual({
        first: '3. ',
        continuation: '   ',
      });
    });

    it('numbers an ordered item from 1 when no number is known', () => {
      const ancestry = [
        generateListItemFrame('item-1', { ordered: true, marker: ')' }),
      ];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '1) ',
        continuation: '   ',
      });
    });

    it('adds a task checkbox for a task item', () => {
      const ancestry = [generateListItemFrame('item-1', { checked: true })];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '- [x] ',
        continuation: '  ',
      });
    });

    it('draws an unchecked box for an unchecked task item', () => {
      const ancestry = [generateListItemFrame('item-1', { checked: false })];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '- [ ] ',
        continuation: '  ',
      });
    });

    it('preserves the checkbox character as authored', () => {
      const ancestry = [
        generateListItemFrame('item-1', {
          checked: true,
          checkedSyntax: 'X',
        }),
      ];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '- [X] ',
        continuation: '  ',
      });
    });
  });

  describe('continuation blocks', () => {
    it('draws no marker for a frame the previous block was inside', () => {
      const ancestry = [generateListItemFrame('item-1')];

      expect(resolveAncestryPrefixes(ancestry, ancestry)).toEqual({
        first: '  ',
        continuation: '  ',
      });
    });

    it('marks only the frames the block starts', () => {
      const item = generateListItemFrame('item-1');
      const nestedItem = generateListItemFrame('item-2');

      // The previous block sat in the outer item only, so the block starts
      // the nested item
      const prefixes = resolveAncestryPrefixes([item, nestedItem], [item]);

      expect(prefixes).toEqual({ first: '  - ', continuation: '    ' });
    });
  });

  describe('nested frames', () => {
    it('composes prefixes outermost first', () => {
      const ancestry = [
        generateBlockquoteFrame('quote-1'),
        generateListItemFrame('item-1'),
      ];

      expect(resolveAncestryPrefixes(ancestry)).toEqual({
        first: '> - ',
        continuation: '>   ',
      });
    });
  });
});
