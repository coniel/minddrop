import { useCallback, useMemo, useState } from 'react';
import { Range } from 'slate';
import { Transforms } from '../Transforms';
import { insertLink } from '../insertLink';
import { insertWikilink } from '../insertWikilink';
import { Editor, EditorReference, ReferenceSource } from '../types';
import { RangeAnchor, getRangeAnchor } from '../utils';

// How many references are offered before anything has been searched for
const RecentReferenceCount = 10;

export interface UseLinkMenu {
  /**
   * The position to show the menu at, or null while it is closed.
   */
  anchor: RangeAnchor | null;

  /**
   * The text typed into the menu's field.
   */
  query: string;

  /**
   * The references offered for the current query.
   */
  references: EditorReference[];

  /**
   * Opens the menu against the current selection.
   */
  open: () => void;

  /**
   * Closes the menu without making a link.
   */
  close: () => void;

  /**
   * Sets the text typed into the menu's field.
   */
  setQuery: (query: string) => void;

  /**
   * Makes a link to a reference from the selected text.
   */
  selectReference: (reference: EditorReference) => void;

  /**
   * Makes a link to a web address from the selected text.
   */
  selectUrl: (url: string) => void;
}

/**
 * Drives the menu which makes a link out of the selected text.
 *
 * @param editor An editor instance.
 * @param source Supplies the references a link can point at.
 * @returns The menu's state and actions.
 */
export function useLinkMenu(
  editor: Editor,
  source?: ReferenceSource,
): UseLinkMenu {
  const [anchor, setAnchor] = useState<RangeAnchor | null>(null);
  const [query, setQuery] = useState('');

  // The range the link is made from, held because the selection moves into
  // the menu's own field once it opens
  const [target, setTarget] = useState<Range | null>(null);

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

  const close = useCallback(() => {
    setAnchor(null);
    setQuery('');
    setTarget(null);
  }, []);

  const open = useCallback(() => {
    const { selection } = editor;

    // The menu makes a link out of selected text, so it needs some
    if (!selection || Range.isCollapsed(selection)) {
      return;
    }

    setTarget(selection);
    setQuery('');
    setAnchor(getRangeAnchor(editor, selection));
  }, [editor]);

  // Makes the link over the text the menu was opened for, which the editor's
  // selection has since left
  const makeLink = useCallback(
    (make: () => void) => {
      if (target) {
        Transforms.select(editor, target);
      }

      make();
      close();
    },
    [editor, target, close],
  );

  const selectReference = useCallback(
    (reference: EditorReference) => {
      // No label is given, so the text the link is made from becomes it
      makeLink(() => insertWikilink(editor, reference.reference));
    },
    [editor, makeLink],
  );

  const selectUrl = useCallback(
    (url: string) => {
      makeLink(() => insertLink(editor, url));
    },
    [editor, makeLink],
  );

  return {
    anchor,
    query,
    references,
    open,
    close,
    setQuery,
    selectReference,
    selectUrl,
  };
}
