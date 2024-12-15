import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';
import { stringifyUnorderedListItemElementBatchToMarkdown } from './stringifyUnorderedListItemElementBatchToMarkdown';

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
