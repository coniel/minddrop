import React from 'react';
import { Range, Editor as SlateEditor, Node as SlateNode } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { Transforms } from '../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement1PlainText,
  paragraphElement2,
  paragraphElement2PlainText,
  paragraphElement3,
  paragraphElement3PlainText,
  setup,
} from '../test-utils';
import { Editor } from '../types';
import { getBlockSelectionRange, getSelectedBlocks } from '../utils';
import { assignBlockIds } from '../withBlockIds';
import { useBlockSelection } from './useBlockSelection';

/**
 * Creates an editor holding three paragraphs.
 *
 * @returns The editor.
 */
function createEditor(): Editor {
  // Blocks carry the IDs the app's selection identifies them by
  return createTestEditor(
    assignBlockIds([paragraphElement1, paragraphElement2, paragraphElement3]),
  );
}

/**
 * Gets the text of each of the editor's blocks, the blocks
 * themselves carrying generated block IDs.
 *
 * @param editor An editor instance.
 * @returns The blocks' text.
 */
function getBlockTexts(editor: Editor): string[] {
  return editor.children.map((block) => SlateNode.string(block));
}

/**
 * Creates a keydown event carrying only the parts of the event
 * the shortcuts are matched against.
 *
 * The modifier shortcuts are held with Control rather than the
 * Command key, the hotkey matching resolving the modifier against
 * the platform, which is not macOS under the test environment.
 *
 * @param key The pressed key.
 * @param modifiers The held modifier keys.
 * @returns The event.
 */
function keyDownEvent(
  key: string,
  modifiers: KeyboardEventInit = {},
): React.KeyboardEvent<HTMLDivElement> {
  const event = {
    nativeEvent: new KeyboardEvent('keydown', { key, ...modifiers }),
    preventDefault: () => undefined,
  };

  return event as React.KeyboardEvent<HTMLDivElement>;
}

describe('useBlockSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('selects the block the cursor is in on Escape', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    Transforms.select(editor, { path: [1, 0], offset: 4 });

    expect(result.current.handleKeyDown(keyDownEvent('Escape'))).toBe(true);
    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 1,
      lastIndex: 1,
    });
  });

  it('returns to a cursor on Escape from a block selection', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([1], false);
    result.current.handleKeyDown(keyDownEvent('Escape'));

    expect(editor.selection && Range.isCollapsed(editor.selection)).toBe(true);
    expect(getSelectedBlocks(editor)).toEqual([]);
  });

  it('deletes the selected blocks on Backspace', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('Backspace'));

    expect(getBlockTexts(editor)).toEqual([
      paragraphElement2PlainText,
      paragraphElement3PlainText,
    ]);
  });

  it('moves the selection to the next block on ArrowDown', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('ArrowDown'));

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 1,
      lastIndex: 1,
    });
  });

  it('keeps the selection on the last block on ArrowDown', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([2], false);
    result.current.handleKeyDown(keyDownEvent('ArrowDown'));

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 2,
      lastIndex: 2,
    });
  });

  it('extends the selection on Shift+ArrowDown', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('ArrowDown', { shiftKey: true }));

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 1,
    });
  });

  it('shrinks the selection from its focused end on Shift+ArrowUp', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('ArrowDown', { shiftKey: true }));
    result.current.handleKeyDown(keyDownEvent('ArrowUp', { shiftKey: true }));

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 0,
    });
  });

  it('moves the selected blocks on Mod+Shift+ArrowDown', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(
      keyDownEvent('ArrowDown', { ctrlKey: true, shiftKey: true }),
    );

    expect(getBlockTexts(editor)).toEqual([
      paragraphElement2PlainText,
      paragraphElement1PlainText,
      paragraphElement3PlainText,
    ]);
  });

  it('moves the block the cursor is in', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    Transforms.select(editor, { path: [1, 0], offset: 4 });
    result.current.handleKeyDown(
      keyDownEvent('ArrowUp', { ctrlKey: true, shiftKey: true }),
    );

    expect(getBlockTexts(editor)).toEqual([
      paragraphElement2PlainText,
      paragraphElement1PlainText,
      paragraphElement3PlainText,
    ]);
  });

  it('duplicates the selected blocks on Mod+D', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('d', { ctrlKey: true }));

    expect(getBlockTexts(editor)).toEqual([
      paragraphElement1PlainText,
      paragraphElement1PlainText,
      paragraphElement2PlainText,
      paragraphElement3PlainText,
    ]);
  });

  it('extends the selection to a block', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.selectBlock([2], true);

    expect(getBlockSelectionRange(editor)).toEqual({
      firstIndex: 0,
      lastIndex: 2,
    });
  });

  it('does nothing when disabled', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, false));

    Transforms.select(editor, SlateEditor.start(editor, [0]));

    expect(result.current.handleKeyDown(keyDownEvent('Escape'))).toBe(false);
    expect(getBlockSelectionRange(editor)).toBeNull();
  });
});
