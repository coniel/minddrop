import { describe, it, expect } from 'vitest';
import { generateBlockElement } from '../../utils';
import { stringifyUnorderedListItemElementToMarkdown } from './stringifyUnorderedListItemElementToMarkdown';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';

const toDoElement = generateBlockElement<UnorderedListItemElement>(
  'unordered-list-item',
  {
    children: [{ text: 'Wash the cat' }],
  },
);

describe('stringifyUnorderedListItemElementToMarkdown', () => {
  it('correctly stringifies unchecked unordered-list-item elements', () => {
    expect(stringifyUnorderedListItemElementToMarkdown(toDoElement)).toBe(
      '- Wash the cat',
    );
  });

  it('correctly stringifies checked unordered-list-item elements', () => {
    expect(
      stringifyUnorderedListItemElementToMarkdown({
        ...toDoElement,
      }),
    ).toBe('- Wash the cat');
  });

  it('pads the unordered-list-item text with spaces accodring to its depth', () => {
    expect(
      stringifyUnorderedListItemElementToMarkdown({ ...toDoElement, depth: 1 }),
    ).toBe('    - Wash the cat');
  });
});
