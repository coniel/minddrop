import { describe, afterEach, it, expect, vi } from 'vitest';
import { parseUnorderedListItemElementFromMarkdown } from './parseUnorderedListItemElementFromMarkdown';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';
import { generateElement } from '../../utils';

const consume = vi.fn();
const getNextLine = vi.fn();

const toDoElement = generateElement<UnorderedListItemElement>(
  'unordered-list-item',
  {
    depth: 0,
    children: [{ text: 'Unordered-list item' }],
  },
);

describe('parseUnorderedListItemElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('matches unordered-list-items', () => {
    const line = '- Unordered-list item';

    const result = parseUnorderedListItemElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(result).toEqual({
      ...toDoElement,
      children: [{ text: 'Unordered-list item' }],
    });
  });

  it('extracts the text content of the unordered-list-item', () => {
    const line = '- Wash the cat';

    const result = parseUnorderedListItemElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(result).toEqual({
      ...toDoElement,
      children: [{ text: 'Wash the cat' }],
    });
  });

  it('determines the depth of the unordered-list-item', () => {
    const line = '    - Unordered-list item';

    const result = parseUnorderedListItemElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(result).toEqual({
      ...toDoElement,
      depth: 1,
    });
  });

  it('ignores extraneous nesting space', () => {
    // This line has 5 leading spaces, but the nesting level
    // should be 1 because nesting levels are determined by
    // four spaces per level.
    const line = '     - Unordered-list item';

    const result = parseUnorderedListItemElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(result).toEqual({
      ...toDoElement,
      depth: 1,
    });
  });

  it('consumes the line if it matches a unordered-list-item', () => {
    const line = '- Unordered-list item';

    parseUnorderedListItemElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match a unordered-list-item', () => {
    const line = 'Some other text';

    const result = parseUnorderedListItemElementFromMarkdown(
      line,
      consume,
      getNextLine,
    );

    expect(result).toBeNull();
  });
});
