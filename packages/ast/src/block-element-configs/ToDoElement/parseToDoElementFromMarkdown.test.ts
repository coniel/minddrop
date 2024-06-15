import { describe, afterEach, it, expect, vi } from 'vitest';
import { parseToDoElementFromMarkdown } from './parseToDoElementFromMarkdown';
import { ToDoElement } from './ToDoElement.types';
import { generateBlockElement } from '../../utils';

const consume = vi.fn();
const getNextLine = vi.fn();

const toDoElement = generateBlockElement<ToDoElement>('to-do', {
  checked: false,
  depth: 0,
  children: [{ text: 'To-do item' }],
});

describe('parseToDoElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches unchecked to-do list items', () => {
    const line = '- [ ] Unchecked to-do item';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      checked: false,
      children: [{ text: 'Unchecked to-do item' }],
    });
  });

  it('matches checked to-do list items', () => {
    const line = '- [x] To-do item';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      checked: true,
      children: [{ text: 'To-do item' }],
    });
  });

  it('extracts the text content of the to-do list item', () => {
    const line = '- [ ] Wash the cat';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      children: [{ text: 'Wash the cat' }],
    });
  });

  it('determines the depth of the to-do list item', () => {
    const line = '    - [ ] To-do item';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      depth: 1,
    });
  });

  it('ignores extraneous nesting space', () => {
    // This line has 5 leading spaces, but the nesting level
    // should be 1 because nesting levels are determined by
    // four spaces per level.
    const line = '     - [ ] To-do item';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toEqual({
      ...toDoElement,
      depth: 1,
    });
  });

  it('consumes the line if it matches a to-do list item', () => {
    const line = '- [ ] To-do item';

    parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match a to-do list item', () => {
    const line = 'Some other text';

    const result = parseToDoElementFromMarkdown(line, consume, getNextLine);

    expect(result).toBeNull();
  });
});
