import { afterEach, describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  getAncestry,
  listItemFrame1,
  paragraphElement1,
  paragraphElement2,
  taskItemFrameIncomplete,
} from '../test-utils';
import { setTaskItemState } from './setTaskItemState';

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('setTaskItemState', () => {
  afterEach(cleanup);

  it('sets the checked state of a task item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrameIncomplete] },
    ]);

    setTaskItemState(editor, taskItemFrameIncomplete.id, true);

    expect(getAncestry(editor, 0)).toEqual([
      { ...taskItemFrameIncomplete, checked: true },
    ]);
  });

  it('turns a plain list item into a task item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [listItemFrame1] },
    ]);

    setTaskItemState(editor, listItemFrame1.id, false);

    expect(getAncestry(editor, 0)).toEqual([
      { ...listItemFrame1, checked: false },
    ]);
  });

  it('updates every block the item holds', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrameIncomplete] },
      // A second block of the same item
      { ...paragraphElement2, ancestry: [taskItemFrameIncomplete] },
    ]);

    setTaskItemState(editor, taskItemFrameIncomplete.id, true);

    expect(getAncestry(editor, 1)).toEqual([
      { ...taskItemFrameIncomplete, checked: true },
    ]);
  });

  it('leaves the item’s other containers alone', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [quote1, taskItemFrameIncomplete] },
    ]);

    setTaskItemState(editor, taskItemFrameIncomplete.id, true);

    expect(getAncestry(editor, 0)).toEqual([
      quote1,
      { ...taskItemFrameIncomplete, checked: true },
    ]);
  });

  it('leaves other items alone', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrameIncomplete] },
      { ...paragraphElement2, ancestry: [listItemFrame1] },
    ]);

    setTaskItemState(editor, taskItemFrameIncomplete.id, true);

    expect(getAncestry(editor, 1)).toEqual([listItemFrame1]);
  });

  it('records the checked syntax it is given', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrameIncomplete] },
    ]);

    setTaskItemState(editor, taskItemFrameIncomplete.id, true, 'X');

    expect(getAncestry(editor, 0)).toEqual([
      { ...taskItemFrameIncomplete, checked: true, checkedSyntax: 'X' },
    ]);
  });

  it('drops the checked syntax when none is given', () => {
    const syntaxedFrame: ListItemFrame = {
      ...taskItemFrameIncomplete,
      checked: true,
      checkedSyntax: 'X',
    };
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [syntaxedFrame] },
    ]);

    setTaskItemState(editor, syntaxedFrame.id, false);

    // The box is written back in its default form
    expect(getAncestry(editor, 0)).toEqual([
      { ...taskItemFrameIncomplete, checked: false },
    ]);
  });
});
