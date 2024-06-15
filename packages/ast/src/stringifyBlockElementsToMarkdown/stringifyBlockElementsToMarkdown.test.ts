import { describe, it, expect } from 'vitest';
import { stringifyBlockElementsToMarkdown } from './stringifyBlockElementsToMarkdown';
import {
  HeadingElement,
  HeadingElementConfig,
  ToDoElement,
  ToDoElementConfig,
} from '../block-element-configs';
import { generateBlockElement } from '../utils';

const blockElementConfigs = [HeadingElementConfig, ToDoElementConfig];
const heading1Element = generateBlockElement<HeadingElement>('heading', {
  level: 1,
  children: [{ text: 'Heading 1' }],
});

const heading2Element = generateBlockElement<HeadingElement>('heading', {
  level: 2,
  children: [{ text: 'Heading 2' }],
});

const toDoElement = generateBlockElement<ToDoElement>('to-do', {
  checked: false,
  children: [{ text: 'To-do item' }],
});

const heading1String = '# Heading 1';
const heading2String = '## Heading 2';
const toDoString = '- [ ] To-do item';

describe('stringifyBlockElements', () => {
  it('separates each element by empty lines', () => {
    expect(
      stringifyBlockElementsToMarkdown(
        [heading1Element, heading2Element],
        blockElementConfigs,
      ),
    ).toBe(`${heading1String}\n\n${heading2String}`);
  });

  it('groups children of the same type into a single block if the config has a `parseBatch` function', () => {
    expect(
      stringifyBlockElementsToMarkdown(
        [heading1Element, toDoElement, toDoElement, heading2Element],
        blockElementConfigs,
      ),
    ).toBe(
      `${heading1String}\n\n${toDoString}\n${toDoString}\n\n${heading2String}`,
    );
  });
});
