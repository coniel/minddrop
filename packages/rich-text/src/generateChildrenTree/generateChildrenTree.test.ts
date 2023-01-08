import { RichTextElements } from '../RichTextElements';
import {
  setup,
  cleanup,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  core,
} from '../test-utils';
import { RTBlockElementDocument } from '../types';
import { generateChildrenTree } from './generateChildrenTree';

const level0Element: RTBlockElementDocument = {
  ...paragraphElement1,
  id: 'level-0',
  children: ['level-1'],
};
const level1Element: RTBlockElementDocument = {
  ...paragraphElement2,
  id: 'level-1',
  children: ['level-2'],
};
const level2Element: RTBlockElementDocument = {
  ...paragraphElement3,
  id: 'level-2',
  children: [{ text: '' }],
};

describe('generateChildrenTree', () => {
  beforeEach(() => {
    setup();

    RichTextElements.store.load(core, [
      level0Element,
      level1Element,
      level2Element,
    ]);
  });

  afterEach(cleanup);

  it('recursively replaces child IDs with child elements', () => {
    // Get the children tree for an element with multiple
    // levels of children.
    const children = generateChildrenTree(level0Element);

    // Should produce a tree of children
    expect(children).toEqual({
      ...level0Element,
      children: [{ ...level1Element, children: [level2Element] }],
    });
  });

  it('does not include undefined children', () => {
    // Get the children tree for an element with child elements
    // that do not exist.
    const children = generateChildrenTree({
      ...paragraphElement1,
      children: ['missing'],
    });

    // Should not contain undefined children
    expect(children).toEqual({
      ...paragraphElement1,
      children: [],
    });
  });
});
