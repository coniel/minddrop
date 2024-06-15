import { describe, it, expect } from 'vitest';
import { generateBlockElement } from '../../utils';
import { stringifyToDoElementBatchToMarkdown } from './stringifyToDoElementBatchToMarkdown';
import { ToDoElement } from './ToDoElement.types';

const toDoElements: ToDoElement[] = [
  generateBlockElement<ToDoElement>('to-do', {
    checked: true,
    children: [
      {
        text: 'Feed the cat',
      },
    ],
  }),
  generateBlockElement<ToDoElement>('to-do', {
    checked: false,
    children: [
      {
        text: 'Wash the cat',
      },
    ],
  }),
];

describe('stringifyToDoElementBatchToMarkdown', () => {
  it('separates stringified to-dos by with a newline', () => {
    expect(stringifyToDoElementBatchToMarkdown(toDoElements)).toBe(
      '- [x] Feed the cat\n- [ ] Wash the cat',
    );
  });
});
