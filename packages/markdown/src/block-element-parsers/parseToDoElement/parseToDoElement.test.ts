import { describe, afterEach, it, expect, vi } from 'vitest';
import { ToDoElement } from '@minddrop/editor';
import { parseToDoElement } from './parseToDoElement';

const consume = vi.fn();
const getNextLine = vi.fn();

const toDoElement: ToDoElement = {
  type: 'to-do',
  level: 'block',
  done: false,
  nestingLevel: 0,
  children: [{ text: 'To-do item' }],
};

describe('parseToDoElement', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches unchecked to-do list items', () => {
    const line = '- [ ] Unchecked to-do item';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      done: false,
      children: [{ text: 'Unchecked to-do item' }],
    });
  });

  it('matches checked to-do list items', () => {
    const line = '- [x] To-do item';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      done: true,
      children: [{ text: 'To-do item' }],
    });
  });

  it('extracts the text content of the to-do list item', () => {
    const line = '- [ ] Wash the cat';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      children: [{ text: 'Wash the cat' }],
    });
  });

  it('determines the nesting level of the to-do list item', () => {
    const line = '  - [ ] To-do item';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      nestingLevel: 1,
    });
  });

  it('ignores extraneous nesting space', () => {
    // This line has 5 leading spaces, but the nesting level
    // should be 2 because nesting levels are determined by
    // two spaces per level.
    const line = '     - [ ] To-do item';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      nestingLevel: 2,
    });
  });

  it('consumes the line if it matches a to-do list item', () => {
    const line = '- [ ] To-do item';

    parseToDoElement(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match a to-do list item', () => {
    const line = 'Some other text';

    const result = parseToDoElement(line, consume, getNextLine);

    expect(result).toBeNull();
  });
});
