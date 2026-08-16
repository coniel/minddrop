import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Path,
  Point,
  Range,
  Editor as SlateEditor,
  Element as SlateElement,
} from 'slate';
import { Element } from '@minddrop/ast';
import { BlockMenuProps } from './BlockMenu';
import { Transforms } from './Transforms';
import { insertBlockElement } from './insertBlockElement';
import { insertInlineElement } from './insertInlineElement';
import { Editor } from './types';
import {
  BlockMenuItem,
  RangeAnchor,
  filterBlockMenuItems,
  getBlockMenuItems,
  getRangeAnchor,
  isBlockElement,
  isInlineElement,
} from './utils';

const TRIGGER_CHARACTER = '/';

export interface UseBlockMenu {
  /**
   * The props with which to render the block menu.
   */
  blockMenuProps: BlockMenuProps;

  /**
   * Key down handler which opens the menu and handles navigating
   * it. Returns true when the event was consumed, in which case
   * no other key down handling should run.
   */
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;

  /**
   * Editor change handler which keeps the search query in sync
   * with the text typed after the trigger character.
   */
  handleChange: () => void;
}

/**
 * Adds a block menu to an editor, opened by typing the trigger
 * character and filtered by the text typed after it. Focus stays
 * in the editor throughout.
 *
 * @param editor An editor instance.
 * @returns The block menu props and editor event handlers.
 */
export function useBlockMenu(editor: Editor): UseBlockMenu {
  // The point at which the trigger character was typed, i.e. the
  // point directly before the character itself.
  const triggerPoint = useRef<Point | null>(null);
  const [armed, setArmed] = useState(false);
  const [anchor, setAnchor] = useState<RangeAnchor | null>(null);
  const [query, setQuery] = useState('');
  const [allMenuItems, setAllMenuItems] = useState<BlockMenuItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // The entries matching the current query
  const menuItems = useMemo(
    () => filterBlockMenuItems(allMenuItems, query),
    [allMenuItems, query],
  );

  // A query which matches nothing hides the menu without
  // disarming it, so that it returns when the query is corrected.
  const open = armed && menuItems.length > 0;

  // The hint prompts for a query, so it is only shown until one
  // has been typed.
  const showHint = armed && query === '';

  // Stops tracking the trigger character
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

    // The query is typed at a single cursor position which stays
    // after the trigger character within the same text node.
    if (
      !editor.selection ||
      !Range.isCollapsed(editor.selection) ||
      !Path.equals(editor.selection.focus.path, point.path) ||
      editor.selection.focus.offset <= point.offset
    ) {
      disarm();

      return;
    }

    const afterTrigger = { ...point, offset: point.offset + 1 };

    // The trigger character is gone once backspaced over
    if (
      SlateEditor.string(editor, { anchor: point, focus: afterTrigger }) !==
      TRIGGER_CHARACTER
    ) {
      disarm();

      return;
    }

    // The query is the text between the trigger character and the
    // cursor, and changing it restarts the highlight at the top.
    setQuery(
      SlateEditor.string(editor, {
        anchor: afterTrigger,
        focus: editor.selection.focus,
      }),
    );
    setActiveIndex(0);
  }, [editor, armed, disarm]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      // The menu only ever reports being closed, e.g. when
      // clicking away from it.
      if (!nextOpen) {
        disarm();
      }
    },
    [disarm],
  );

  // Replaces the trigger character and query text with a block
  // element of the entry's type.
  function insertMenuItem(menuItem: BlockMenuItem): void {
    const point = triggerPoint.current;

    disarm();

    if (point && editor.selection) {
      // Remove the trigger character and the query typed after it
      Transforms.delete(editor, {
        at: { anchor: point, focus: editor.selection.focus },
      });
    }

    // An inline entry goes into the block the cursor is in rather than
    // becoming a block of its own
    if (isInlineElement(menuItem.type)) {
      insertInlineElement(editor, menuItem.type, menuItem.data);

      return;
    }

    insertBlockElement(editor, menuItem.type, menuItem.data, menuItem.frame);
  }

  // Opens the menu when the trigger character is typed in a
  // position at which a block can be inserted. The character
  // itself is typed as usual.
  function handleTriggerKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ): boolean {
    // Only a plain trigger character opens the menu
    if (event.key !== TRIGGER_CHARACTER || event.metaKey || event.ctrlKey) {
      return false;
    }

    // The menu inserts a block at the cursor, so it needs one
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      return false;
    }

    // Only open within registered block element types, which
    // excludes the editor's internal blocks such as the title.
    const inBlockElement = SlateEditor.above(editor, {
      match: (node) =>
        SlateElement.isElement(node) && isBlockElement((node as Element).type),
    });

    if (!inBlockElement) {
      return false;
    }

    // Open at the start of a block or after whitespace only, so
    // that the character can still be typed within a word.
    const pointBefore = SlateEditor.before(editor, editor.selection.focus, {
      unit: 'character',
    });
    const characterBefore = pointBefore
      ? SlateEditor.string(editor, {
          anchor: pointBefore,
          focus: editor.selection.focus,
        })
      : '';

    if (characterBefore.trim() !== '') {
      return false;
    }

    // The cursor sits directly before the character about to be
    // typed, which is where the query starts.
    const point = editor.selection.focus;

    triggerPoint.current = point;

    setAllMenuItems(getBlockMenuItems());
    setQuery('');
    setActiveIndex(0);
    setArmed(true);

    // Measure the trigger character itself once it has been typed
    // and laid out, giving the exact box the query text follows.
    requestAnimationFrame(() => {
      setAnchor(
        getRangeAnchor(editor, {
          anchor: point,
          focus: { ...point, offset: point.offset + 1 },
        }),
      );
    });

    return false;
  }

  // Handles the keys the menu takes over from the editor while
  // it is listed.
  function handleMenuKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ): boolean {
    // Move the highlight down, wrapping around the end
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % menuItems.length);

      return true;
    }

    // Move the highlight up, wrapping around the start
    if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + menuItems.length) % menuItems.length,
      );

      return true;
    }

    // Insert the highlighted entry's block type
    if (event.key === 'Enter') {
      event.preventDefault();
      insertMenuItem(menuItems[activeIndex]);

      return true;
    }

    // Dismiss the menu, leaving the typed text in place
    if (event.key === 'Escape') {
      event.preventDefault();
      disarm();

      return true;
    }

    return false;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): boolean {
    // The menu handles navigation keys while it is listed
    if (open) {
      return handleMenuKeyDown(event);
    }

    return handleTriggerKeyDown(event);
  }

  function handleSelect(index: number): void {
    insertMenuItem(menuItems[index]);
  }

  return {
    blockMenuProps: {
      open,
      onOpenChange: handleOpenChange,
      anchor,
      showHint,
      menuItems,
      activeIndex,
      onHighlight: setActiveIndex,
      onSelect: handleSelect,
    },
    handleKeyDown,
    handleChange,
  };
}
