import { useCallback, useEffect, useRef, useState } from 'react';
import { Range, Editor as SlateEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { MarkKey } from '@minddrop/ast';
import { Editor } from '../types';
import { RangeAnchor, getRangeAnchor, getSelectedBlocks } from '../utils';

export interface UseSelectionToolbar {
  /**
   * The position to show the toolbar at, or null when no toolbar is shown.
   */
  anchor: RangeAnchor | null;

  /**
   * The marks applied across the whole selection.
   */
  activeMarks: MarkKey[];

  /**
   * Toggles a mark on the selected text.
   */
  toggleMark: (mark: MarkKey) => void;

  /**
   * Editor change handler which shows and hides the toolbar.
   */
  handleChange: () => void;
}

/**
 * Tracks the editor's selected text, so that a toolbar can be shown against
 * it.
 *
 * The toolbar follows a text selection only. Selected blocks are acted on
 * through the block actions menu, and showing both at once would offer two
 * sets of actions for one selection.
 *
 * @param editor An editor instance.
 * @param enabled Whether the toolbar is shown.
 * @returns The toolbar's position, the selection's marks and its actions.
 */
export function useSelectionToolbar(
  editor: Editor,
  enabled: boolean,
): UseSelectionToolbar {
  const [anchor, setAnchor] = useState<RangeAnchor | null>(null);
  const [activeMarks, setActiveMarks] = useState<MarkKey[]>([]);

  // Whether the pointer is drawing the selection, during which it has no
  // settled position to show the toolbar at. Held in a ref so that the
  // change handler always reads it as it currently stands.
  const selecting = useRef(false);

  const clear = useCallback(() => {
    setAnchor(null);
    setActiveMarks([]);
  }, []);

  const handleChange = useCallback(() => {
    const { selection } = editor;

    // The toolbar acts on text, so it needs some to be selected. Selected
    // blocks are the block actions menu's to act on.
    if (
      !enabled ||
      selecting.current ||
      !selection ||
      Range.isCollapsed(selection) ||
      !ReactEditor.isFocused(editor) ||
      getSelectedBlocks(editor).length
    ) {
      clear();

      return;
    }

    setActiveMarks(resolveActiveMarks(editor));

    // Measured once and then held. Applying a mark rewrites the selected
    // text, which leaves it momentarily unmeasurable and then measuring at
    // a different width, so a toolbar which re-measured would blink and
    // then shift out from under the pointer.
    setAnchor((current) => current ?? getRangeAnchor(editor, selection));
  }, [editor, enabled, clear]);

  const toggleMark = useCallback(
    (mark: MarkKey) => {
      editor.toggleMark(mark);

      // The marks are read back rather than assumed, since a mark can be
      // refused, and the toolbar shows what the text now carries
      setActiveMarks(resolveActiveMarks(editor));
    },
    [editor],
  );

  // A selection drawn with the pointer is only settled once the button is
  // released, so the toolbar waits for it rather than following the drag
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      // Only a press in the content can be drawing a selection. Presses
      // elsewhere include the toolbar's own buttons, which would otherwise
      // take the toolbar away from under the pointer before the press
      // landed on it.
      if (!isInEditorContent(editor, event.target)) {
        return;
      }

      selecting.current = true;

      // The held position belongs to the selection being replaced
      clear();
    };

    const handlePointerUp = () => {
      selecting.current = false;

      // The selection is applied after the press, so it is read on the
      // frame after it
      requestAnimationFrame(handleChange);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [editor, enabled, clear, handleChange]);

  // The toolbar is held at the position the text was in when it opened, so
  // scrolling would leave it behind, floating over whatever has scrolled
  // under it. It is dismissed instead, as the block menu is.
  useEffect(() => {
    if (!anchor) {
      return;
    }

    document.addEventListener('scroll', clear, true);

    return () => {
      document.removeEventListener('scroll', clear, true);
    };
  }, [anchor, clear]);

  return { anchor, activeMarks, toggleMark, handleChange };
}

/**
 * Checks whether a node is within the editor's editable content.
 *
 * @param editor An editor instance.
 * @param node The node to check.
 * @returns Whether the node is in the editor's content.
 */
function isInEditorContent(editor: Editor, node: EventTarget | null): boolean {
  if (!(node instanceof Node)) {
    return false;
  }

  try {
    return ReactEditor.toDOMNode(editor, editor).contains(node);
  } catch {
    // The editor may not be rendered
    return false;
  }
}

/**
 * Returns the marks applied across the whole of the editor's selection.
 *
 * @param editor An editor instance.
 * @returns The active marks.
 */
function resolveActiveMarks(editor: Editor): MarkKey[] {
  const marks = SlateEditor.marks(editor) || {};

  return Object.keys(marks).filter(
    (key): key is MarkKey => marks[key as MarkKey] === true,
  );
}
