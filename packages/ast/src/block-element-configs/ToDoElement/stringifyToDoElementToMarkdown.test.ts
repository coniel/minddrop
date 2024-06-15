import { describe, it, expect } from 'vitest';
import { generateBlockElement } from '../../utils';
import { stringifyToDoElementToMarkdown } from './stringifyToDoElementToMarkdown';
import { ToDoElement } from './ToDoElement.types';

const toDoElement = generateBlockElement<ToDoElement>('to-do', {
  checked: false,
  children: [{ text: 'Wash the cat' }],
});

describe('stringifyToDoElementToMarkdown', () => {
  it('correctly stringifies unchecked to-do elements', () => {
    expect(stringifyToDoElementToMarkdown(toDoElement)).toBe(
      '- [ ] Wash the cat',
    );
  });

  it('correctly stringifies checked to-do elements', () => {
    expect(
      stringifyToDoElementToMarkdown({ ...toDoElement, checked: true }),
    ).toBe('- [x] Wash the cat');
  });

  it('pads the to-do text with spaces accodring to its depth', () => {
    expect(stringifyToDoElementToMarkdown({ ...toDoElement, depth: 1 })).toBe(
      '    - [ ] Wash the cat',
    );
  });
});
