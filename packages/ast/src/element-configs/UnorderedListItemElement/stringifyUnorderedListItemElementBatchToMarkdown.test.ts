import { describe, it, expect } from 'vitest';
import { generateElement } from '../../utils';
import { stringifyUnorderedListItemElementBatchToMarkdown } from './stringifyUnorderedListItemElementBatchToMarkdown';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';

const toDoElements: UnorderedListItemElement[] = [
  generateElement<UnorderedListItemElement>('unordered-list-item', {
    children: [
      {
        text: 'Feed the cat',
      },
    ],
  }),
  generateElement<UnorderedListItemElement>('unordered-list-item', {
    children: [
      {
        text: 'Wash the cat',
      },
    ],
  }),
];

describe('stringifyUnorderedListItemElementBatchToMarkdown', () => {
  it('separates stringified unordered-list-items by with a newline', () => {
    expect(stringifyUnorderedListItemElementBatchToMarkdown(toDoElements)).toBe(
      '- Feed the cat\n- Wash the cat',
    );
  });
});
