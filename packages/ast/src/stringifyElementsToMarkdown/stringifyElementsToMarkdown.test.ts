import { describe, expect, it } from 'vitest';
import {
  HeadingElement,
  HeadingElementConfig,
  ToDoElement,
  ToDoElementConfig,
} from '../element-configs';
import { generateElement } from '../utils';
import { stringifyElementsToMarkdown } from './stringifyElementsToMarkdown';

const blockElementConfigs = [HeadingElementConfig, ToDoElementConfig];
const heading1Element = generateElement<HeadingElement>('heading', {
  level: 1,
  children: [{ text: 'Heading 1' }],
});

const heading2Element = generateElement<HeadingElement>('heading', {
  level: 2,
  children: [{ text: 'Heading 2' }],
});

const toDoElement = generateElement<ToDoElement>('to-do', {
  checked: false,
  children: [{ text: 'To-do item' }],
});

const heading1String = '# Heading 1';
const heading2String = '## Heading 2';
const toDoString = '- [ ] To-do item';

describe('stringifyElements', () => {
  it('separates each element by empty lines', () => {
    expect(
      stringifyElementsToMarkdown(
        [heading1Element, heading2Element],
        blockElementConfigs,
      ),
    ).toBe(`${heading1String}\n\n${heading2String}`);
  });

  it('groups children of the same type into a single block if the config has a `parseBatch` function', () => {
    expect(
      stringifyElementsToMarkdown(
        [heading1Element, toDoElement, toDoElement, heading2Element],
        blockElementConfigs,
      ),
    ).toBe(
      `${heading1String}\n\n${toDoString}\n${toDoString}\n\n${heading2String}`,
    );
  });
});
