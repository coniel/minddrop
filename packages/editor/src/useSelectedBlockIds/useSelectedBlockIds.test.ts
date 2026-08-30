import { afterEach, describe, expect, it } from 'vitest';
import { Element } from '@minddrop/ast';
import { Selection } from '@minddrop/selection';
import { act, renderHook } from '@minddrop/test-utils';
import { selectBlocks } from '../selectBlocks';
import {
  cleanup,
  createTestEditorWithBlockIds,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { Editor } from '../types';
import { hasBlockId } from '../utils';
import { useSelectedBlockIds } from './useSelectedBlockIds';

// Blocks carry the IDs the app's selection identifies them by
const createEditor = () =>
  createTestEditorWithBlockIds([paragraphElement1, paragraphElement2]);

/**
 * Gets the IDs of the editor's blocks.
 *
 * @param editor An editor instance.
 * @returns The blocks' IDs.
 */
function getBlockIds(editor: Editor): string[] {
  return (editor.children as Element[])
    .filter(hasBlockId)
    .map((block) => block.id);
}

describe('useSelectedBlockIds', () => {
  afterEach(cleanup);

  it('returns nothing while no blocks are selected', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useSelectedBlockIds(editor));

    expect(result.current.size).toBe(0);
  });

  it('returns the IDs of the editor’s selected blocks', () => {
    const editor = createEditor();
    const { result } = renderHook(() => useSelectedBlockIds(editor));

    act(() => {
      selectBlocks(editor, [0], [1]);
    });

    expect([...result.current].sort()).toEqual(getBlockIds(editor).sort());
  });

  it('leaves out another editor’s blocks', () => {
    const editor = createEditor();
    const otherEditor = createEditor();
    const { result } = renderHook(() => useSelectedBlockIds(editor));

    act(() => {
      selectBlocks(otherEditor, [0], [0]);
    });

    expect(result.current.size).toBe(0);
  });

  it('deselects the editor’s blocks when it closes', () => {
    const editor = createEditor();
    const { unmount } = renderHook(() => useSelectedBlockIds(editor));

    act(() => {
      selectBlocks(editor, [0], [1]);
    });

    unmount();

    // Nothing of the editor's is left in the app's selection
    expect(Selection.isEmpty()).toBe(true);
  });
});
