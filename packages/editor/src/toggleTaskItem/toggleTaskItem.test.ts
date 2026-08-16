import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import { createTestEditor } from '../test-utils';
import {
  listItemFrame1,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils/editor.data';
import { Editor } from '../types';
import { toggleTaskItem } from './toggleTaskItem';

// A task item, which is a list item carrying a checked state
const taskItemFrame: ListItemFrame = { ...listItemFrame1, checked: false };

// Returns the frame a block sits inside as it stands in the editor
function getFrame(editor: Editor, index: number): ListItemFrame | undefined {
  const element = editor.children[index] as Element;
  const frame = element.ancestry?.[0];

  return frame?.kind === 'list-item' ? frame : undefined;
}

describe('toggleTaskItem', () => {
  it('checks an unchecked item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrame] },
    ]);

    toggleTaskItem(editor, taskItemFrame.id);

    expect(getFrame(editor, 0)?.checked).toBe(true);
  });

  it('unchecks a checked item', () => {
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        ancestry: [{ ...taskItemFrame, checked: true }],
      },
    ]);

    toggleTaskItem(editor, taskItemFrame.id);

    expect(getFrame(editor, 0)?.checked).toBe(false);
  });

  it('updates every block in the item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [taskItemFrame] },
      { ...paragraphElement2, ancestry: [taskItemFrame] },
    ]);

    toggleTaskItem(editor, taskItemFrame.id);

    expect(getFrame(editor, 0)?.checked).toBe(true);
    expect(getFrame(editor, 1)?.checked).toBe(true);
  });

  it('drops the authored checkbox spelling', () => {
    const editor = createTestEditor([
      {
        ...paragraphElement1,
        ancestry: [{ ...taskItemFrame, checked: true, checkedSyntax: 'X' }],
      },
    ]);

    toggleTaskItem(editor, taskItemFrame.id);

    expect(getFrame(editor, 0)?.checkedSyntax).toBeUndefined();
  });

  it('does nothing to a plain list item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [listItemFrame1] },
    ]);

    toggleTaskItem(editor, listItemFrame1.id);

    expect(getFrame(editor, 0)).toEqual(listItemFrame1);
  });

  it('does nothing when the frame is not in the document', () => {
    const editor = createTestEditor([paragraphElement1]);

    toggleTaskItem(editor, taskItemFrame.id);

    expect(editor.children).toEqual([paragraphElement1]);
  });
});
