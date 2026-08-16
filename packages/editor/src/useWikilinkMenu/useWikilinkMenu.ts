import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Path, Point, Range, Editor as SlateEditor } from 'slate';
import { Transforms } from '../Transforms';
import { insertWikilink } from '../insertWikilink';
import { Editor, EditorReference, ReferenceSource } from '../types';
import { RangeAnchor, getRangeAnchor } from '../utils';

// The text which opens the menu, being the opening of a wikilink
const Trigger = '[[';

// How many references are offered before anything has been searched for
const RecentReferenceCount = 10;

export interface UseWikilinkMenu {
  /**
   * The props with which to render the reference menu.
   */
  referenceMenuProps: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anchor: RangeAnchor | null;
    showHint: boolean;
    references: EditorReference[];
    activeIndex: number;
    onHighlight: (index: number) => void;
    onSelect: (index: number) => void;
  };

  /**
   * Key down handler which navigates the menu. Returns true when the event
   * was consumed.
   */
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;

  /**
   * Editor change handler which keeps the query in sync with the text typed
   * after the trigger.
   */
  handleChange: () => void;
}

/**
 * Adds the menu opened by typing a wikilink's opening brackets, which links
 * to the reference chosen from it.
 *
 * The cursor stays in the document throughout, the query being the text typed
 * after the trigger, as it is for the block menu.
 *
 * @param editor An editor instance.
 * @param source Supplies the references which can be linked to.
 * @returns The menu props and editor event handlers.
 */
export function useWikilinkMenu(
  editor: Editor,
  source?: ReferenceSource,
): UseWikilinkMenu {
  // The point at which the trigger was typed, being the point directly
  // before it
  const triggerPoint = useRef<Point | null>(null);
  const [armed, setArmed] = useState(false);
  const [anchor, setAnchor] = useState<RangeAnchor | null>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const references = useMemo(() => {
    if (!source) {
      return [];
    }

    // Nothing typed yet, so the most recent references are offered
    if (!query) {
      return source.getRecent().slice(0, RecentReferenceCount);
    }

    return source.search(query);
  }, [source, query]);

  // A query which matches nothing hides the menu without disarming it, so
  // that it returns when the query is corrected
  const open = armed && references.length > 0;

  // The hint prompts for a query, so it is only shown until one has been
  // typed
  const showHint = armed && query === '';

  const disarm = useCallback(() => {
    setArmed(false);

    triggerPoint.current = null;
  }, []);

  const handleChange = useCallback(() => {
    const point = triggerPoint.current;

    // Nothing to track while the menu is closed
    if (!armed || !point) {
      return;
    }

    // The query is typed at a single cursor position which stays after the
    // trigger within the same text node
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      !Path.equals(editor.selection.focus.path, point.path) ||
      editor.selection.focus.offset < point.offset + Trigger.length
    ) {
      disarm();

      return;
    }

    const afterTrigger = { ...point, offset: point.offset + Trigger.length };

    // The trigger is gone once backspaced over
    if (
      SlateEditor.string(editor, { anchor: point, focus: afterTrigger }) !==
      Trigger
    ) {
      disarm();

      return;
    }

    // The query is the text between the trigger and the cursor, and changing
    // it restarts the highlight at the top
    setQuery(
      SlateEditor.string(editor, {
        anchor: afterTrigger,
        focus: editor.selection.focus,
      }),
    );
    setActiveIndex(0);
  }, [editor, armed, disarm]);

  // Replaces the trigger and the query with a link to the chosen reference
  const selectReference = useCallback(
    (index: number) => {
      const reference = references[index];
      const point = triggerPoint.current;

      disarm();

      if (!reference) {
        return;
      }

      if (point && editor.selection) {
        // Remove the trigger and the query typed after it
        Transforms.delete(editor, {
          at: { anchor: point, focus: editor.selection.focus },
        });
      }

      // No text was selected, so the link shows the reference's own label
      insertWikilink(editor, reference.reference, reference.label);
    },
    [editor, references, disarm],
  );

  // Opens the menu when the trigger is completed, which is the second of its
  // brackets being typed
  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== Trigger[1] || event.metaKey || event.ctrlKey) {
        return;
      }

      if (!editor.selection || !Range.isCollapsed(editor.selection)) {
        return;
      }

      const { focus } = editor.selection;

      // The trigger opens only when its first bracket is already there
      const start = { ...focus, offset: focus.offset - 1 };

      if (
        start.offset < 0 ||
        SlateEditor.string(editor, { anchor: start, focus }) !== Trigger[0]
      ) {
        return;
      }

      // The menu is anchored to the trigger as a whole, so it opens from the
      // first of its brackets
      triggerPoint.current = start;

      setQuery('');
      setActiveIndex(0);
      setArmed(true);

      // Measure the trigger once it has been typed and laid out
      requestAnimationFrame(() => {
        const point = triggerPoint.current;

        if (!point) {
          return;
        }

        setAnchor(
          getRangeAnchor(editor, {
            anchor: point,
            focus: { ...point, offset: point.offset + Trigger.length },
          }),
        );
      });
    },
    [editor],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // The trigger is watched for whether or not the menu is open, and the
      // bracket itself is typed as usual
      handleTriggerKeyDown(event);

      if (!open) {
        return false;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % references.length);

        return true;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + references.length) % references.length,
        );

        return true;
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        selectReference(activeIndex);

        return true;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        disarm();

        return true;
      }

      return false;
    },
    [
      open,
      references,
      activeIndex,
      selectReference,
      disarm,
      handleTriggerKeyDown,
    ],
  );

  return {
    referenceMenuProps: {
      open,
      onOpenChange: disarm,
      anchor,
      showHint,
      references,
      activeIndex,
      onHighlight: setActiveIndex,
      onSelect: selectReference,
    },
    handleKeyDown,
    handleChange,
  };
}
