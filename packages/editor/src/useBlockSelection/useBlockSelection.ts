import isHotkey from 'is-hotkey';
import React, { useCallback } from 'react';
import { Path, Range, Editor as SlateEditor } from 'slate';
import { Transforms } from '../Transforms';
import { clearBlockSelection } from '../clearBlockSelection';
import { deleteBlocks } from '../deleteBlocks';
import { duplicateBlocks } from '../duplicateBlocks';
import { moveBlocks } from '../moveBlocks';
import { selectBlocks } from '../selectBlocks';
import { Editor } from '../types';
import {
  getBlockSelectionRange,
  getContentStartIndex,
  getSelectedBlocks,
} from '../utils';

// Matched by key rather than by key code, the shortcuts being
// about the keys' meaning rather than their position
const byKey = { byKey: true } as const;
const isEscape = isHotkey('escape', byKey);
const isBackspace = isHotkey('backspace', byKey);
const isDelete = isHotkey('delete', byKey);
const isArrowUp = isHotkey('up', byKey);
const isArrowDown = isHotkey('down', byKey);
const isExtendUp = isHotkey('shift+up', byKey);
const isExtendDown = isHotkey('shift+down', byKey);
const isMoveUp = isHotkey('mod+shift+up', byKey);
const isMoveDown = isHotkey('mod+shift+down', byKey);
const isDuplicate = isHotkey('mod+d', byKey);

export interface UseBlockSelection {
  /**
   * Keydown handler applying the block selection shortcuts.
   * Returns whether the event was consumed.
   */
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;

  /**
   * Selects a block, or extends the current block selection to it.
   * Used by the block controls, which sit outside the editor.
   */
  selectBlock: (path: Path, extend: boolean) => void;
}

/**
 * Provides the keyboard and pointer routes into a block selection,
 * along with the actions which operate on one.
 *
 * @param editor An editor instance.
 * @param enabled Whether blocks can be selected.
 * @returns The block selection handlers.
 */
export function useBlockSelection(
  editor: Editor,
  enabled: boolean,
): UseBlockSelection {
  const selectBlock = useCallback(
    (path: Path, extend: boolean) => {
      selectBlocks(editor, extend ? getAnchorPath(editor, path) : path, path);
    },
    [editor],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Read-only editors have no blocks to select
      if (!enabled) {
        return false;
      }

      const range = getBlockSelectionRange(editor);

      if (isEscape(event.nativeEvent)) {
        // A block selection steps back down to a cursor
        if (range) {
          clearBlockSelection(editor);

          Transforms.select(editor, SlateEditor.end(editor, [range.lastIndex]));
          event.preventDefault();

          return true;
        }

        const path = getCursorBlockPath(editor);

        // The title cannot be selected as a block
        if (!path) {
          return false;
        }

        selectBlock(path, false);
        event.preventDefault();

        return true;
      }

      // Blocks are moved and duplicated from a cursor as well as
      // from a block selection
      if (isMoveUp(event.nativeEvent) || isMoveDown(event.nativeEvent)) {
        const paths = getTargetBlockPaths(editor);

        if (!paths.length) {
          return false;
        }

        moveBlocks(editor, paths, isMoveUp(event.nativeEvent) ? 'up' : 'down');
        event.preventDefault();

        return true;
      }

      if (isDuplicate(event.nativeEvent)) {
        const paths = getTargetBlockPaths(editor);

        if (!paths.length) {
          return false;
        }

        duplicateBlocks(editor, paths);
        event.preventDefault();

        return true;
      }

      // The remaining shortcuts act on a block selection
      if (!range) {
        return false;
      }

      if (isBackspace(event.nativeEvent) || isDelete(event.nativeEvent)) {
        deleteBlocks(
          editor,
          getSelectedBlocks(editor).map(([, path]) => path),
        );
        event.preventDefault();

        return true;
      }

      const extend =
        isExtendUp(event.nativeEvent) || isExtendDown(event.nativeEvent);

      if (
        !extend &&
        !isArrowUp(event.nativeEvent) &&
        !isArrowDown(event.nativeEvent)
      ) {
        return false;
      }

      const up = isArrowUp(event.nativeEvent) || isExtendUp(event.nativeEvent);

      // Extending moves the focused end of the selection, while
      // the arrows on their own move the whole selection
      if (extend) {
        const backward = editor.selection
          ? Range.isBackward(editor.selection)
          : false;
        const focusIndex = backward ? range.firstIndex : range.lastIndex;
        const anchorIndex = backward ? range.lastIndex : range.firstIndex;

        selectBlocks(
          editor,
          [anchorIndex],
          [clampBlockIndex(editor, focusIndex + (up ? -1 : 1))],
        );
      } else {
        const index = up ? range.firstIndex - 1 : range.lastIndex + 1;

        selectBlock([clampBlockIndex(editor, index)], false);
      }

      event.preventDefault();

      return true;
    },
    [editor, enabled, selectBlock],
  );

  return { handleKeyDown, selectBlock };
}

/**
 * Gets the path of the block the cursor is in.
 *
 * @param editor An editor instance.
 * @returns The block's path, or null if the cursor is not in a content block.
 */
function getCursorBlockPath(editor: Editor): Path | null {
  if (!editor.selection) {
    return null;
  }

  const index = Range.start(editor.selection).path[0];

  // The title is not a content block
  if (index < getContentStartIndex(editor)) {
    return null;
  }

  return [index];
}

/**
 * Gets the paths of the blocks an action applies to, being the
 * selected blocks or, without a block selection, the block the
 * cursor is in.
 *
 * @param editor An editor instance.
 * @returns The blocks' paths.
 */
function getTargetBlockPaths(editor: Editor): Path[] {
  const selectedBlocks = getSelectedBlocks(editor);

  if (selectedBlocks.length) {
    return selectedBlocks.map(([, path]) => path);
  }

  const cursorPath = getCursorBlockPath(editor);

  return cursorPath ? [cursorPath] : [];
}

/**
 * Gets the path of the block a selection extended to the given
 * block is anchored to.
 *
 * @param editor An editor instance.
 * @param path The path of the block being extended to.
 * @returns The anchor block's path.
 */
function getAnchorPath(editor: Editor, path: Path): Path {
  if (!editor.selection) {
    return path;
  }

  const index = editor.selection.anchor.path[0];

  // Without a block to extend from, only the given block is
  // selected
  if (index < getContentStartIndex(editor)) {
    return path;
  }

  return [index];
}

/**
 * Keeps a block index within the editor's content blocks.
 *
 * @param editor An editor instance.
 * @param index The index to clamp.
 * @returns The clamped index.
 */
function clampBlockIndex(editor: Editor, index: number): number {
  return Math.min(
    Math.max(index, getContentStartIndex(editor)),
    editor.children.length - 1,
  );
}
