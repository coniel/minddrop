import React from 'react';
import { Range, Editor as SlateEditor } from 'slate';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { Transforms } from '../Transforms';
import {
  cleanup,
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  setup,
} from '../test-utils';
import { Editor } from '../types';
import { getBlockSelectionRange } from '../utils';
import { useBlockSelection } from './useBlockSelection';

/**
 * Creates an editor holding three paragraphs.
 *
 * @returns The editor.
 */
function createEditor(): Editor {
  return createTestEditor([
    paragraphElement1,
    paragraphElement2,
    paragraphElement3,
  ]);
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
    expect(editor.blockSelectionMode).toBe(false);
  });

  it('deletes the selected blocks on Backspace', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('Backspace'));

    expect(editor.children).toEqual([paragraphElement2, paragraphElement3]);
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

    expect(editor.children).toEqual([
      paragraphElement2,
      paragraphElement1,
      paragraphElement3,
    ]);
  });

  it('moves the block the cursor is in', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    Transforms.select(editor, { path: [1, 0], offset: 4 });
    result.current.handleKeyDown(
      keyDownEvent('ArrowUp', { ctrlKey: true, shiftKey: true }),
    );

    expect(editor.children).toEqual([
      paragraphElement2,
      paragraphElement1,
      paragraphElement3,
    ]);
  });

  it('duplicates the selected blocks on Mod+D', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useBlockSelection(editor, true));

    result.current.selectBlock([0], false);
    result.current.handleKeyDown(keyDownEvent('d', { ctrlKey: true }));

    expect(editor.children).toEqual([
      paragraphElement1,
      paragraphElement1,
      paragraphElement2,
      paragraphElement3,
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
