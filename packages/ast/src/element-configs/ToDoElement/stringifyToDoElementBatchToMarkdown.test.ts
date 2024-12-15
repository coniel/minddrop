import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { ToDoElement } from './ToDoElement.types';
import { stringifyToDoElementBatchToMarkdown } from './stringifyToDoElementBatchToMarkdown';

const toDoElements: ToDoElement[] = [
  generateElement<ToDoElement>('to-do', {
    checked: true,
    children: [
      {
        text: 'Feed the cat',
      },
    ],
  }),
  generateElement<ToDoElement>('to-do', {
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
