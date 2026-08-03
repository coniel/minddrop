import { useCallback, useEffect, useRef, useState } from 'react';
import { Node } from 'slate';
import { isUntitledTitle } from '@minddrop/utils';
import { Editor } from '../types';
import { isSelectionInTitle, setTitleText } from './utils';

export interface UseEditorTitleOptions {
  /**
   * The externally provided title value. Default untitled titles
   * are displayed as an empty title.
   */
  title?: string;

  /**
   * Callback fired when a valid title change is committed.
   */
  onTitleChange?: (title: string) => void;

  /**
   * Callback used to validate the title on every change.
   * Returns a translated error message when invalid.
   */
  validateTitle?: (title: string) => string | undefined;
}

export interface UseEditorTitleResult {
  /**
   * Translated validation error for the current title text.
   */
  titleError?: string;

  /**
   * Handler to call on every editor change, before emitting
   * the value to consumers.
   */
  handleEditorChange: () => void;

  /**
   * Handler to call when focus leaves the editable area.
   */
  handleEditorBlur: () => void;
}

/**
 * Manages the title feature's commit, revert, and validation
 * behaviour. A title edit is committed when the selection leaves
 * the title element with a valid value, and reverted to the last
 * committed value when it leaves with an invalid one.
 *
 * @param editor - The editor instance.
 * @param hasTitle - Whether the title feature is enabled.
 * @param options - The title value and callbacks.
 * @returns The validation error and editor event handlers.
 */
export function useEditorTitle(
  editor: Editor,
  hasTitle: boolean,
  { title, onTitleChange, validateTitle }: UseEditorTitleOptions,
): UseEditorTitleResult {
  // The title as displayed in the title node. Untitled titles
  // display empty so a name can be typed straight away.
  const displayedTitle =
    title !== undefined && isUntitledTitle(title) ? '' : (title ?? '');

  // Last committed title value, used to detect changes and revert invalid edits
  const committedTitleRef = useRef(displayedTitle);
  // Whether the selection was inside the title on the previous change
  const selectionWasInTitleRef = useRef(false);
  // Last observed title text, used to run validation only on actual changes
  const lastTitleTextRef = useRef(displayedTitle);
  // Validation error for the current title text
  const [titleError, setTitleError] = useState<string | undefined>();

  // Keep the latest callbacks in refs so handler identities stay stable
  const onTitleChangeRef = useRef(onTitleChange);
  onTitleChangeRef.current = onTitleChange;
  const validateTitleRef = useRef(validateTitle);
  validateTitleRef.current = validateTitle;

  // Commit the current title, or revert it when invalid
  const commitOrRevert = useCallback(() => {
    const currentTitle = Node.string(editor.children[0]);

    // Revalidate rather than relying on possibly stale error state
    const error = validateTitleRef.current?.(currentTitle);

    if (error !== undefined) {
      // Revert the title to the last committed value
      setTitleText(editor, committedTitleRef.current);
      lastTitleTextRef.current = committedTitleRef.current;
      setTitleError(undefined);

      return;
    }

    // Clear any stale validation error
    setTitleError(undefined);

    // Nothing to commit when the title is unchanged
    if (currentTitle === committedTitleRef.current) {
      return;
    }

    // Commit the new title
    committedTitleRef.current = currentTitle;
    onTitleChangeRef.current?.(currentTitle);
  }, [editor]);

  const handleEditorChange = useCallback(() => {
    // The title feature is disabled
    if (!hasTitle) {
      return;
    }

    const currentTitle = Node.string(editor.children[0]);

    // Validate when the title text actually changed
    if (currentTitle !== lastTitleTextRef.current) {
      lastTitleTextRef.current = currentTitle;
      setTitleError(validateTitleRef.current?.(currentTitle));
    }

    // Whether the selection is currently inside the title
    const selectionInTitle = isSelectionInTitle(editor);

    // Commit or revert when the selection leaves the title
    if (selectionWasInTitleRef.current && !selectionInTitle) {
      commitOrRevert();
    }

    selectionWasInTitleRef.current = selectionInTitle;
  }, [editor, hasTitle, commitOrRevert]);

  const handleEditorBlur = useCallback(() => {
    // Only act when focus leaves mid title edit
    if (!hasTitle || !selectionWasInTitleRef.current) {
      return;
    }

    // Commit or revert the in-progress title edit
    commitOrRevert();
    selectionWasInTitleRef.current = false;
  }, [hasTitle, commitOrRevert]);

  // Sync external title prop changes into the title node. Keyed on
  // the raw title so renames between untitled values still re-sync.
  useEffect(() => {
    // Skip when disabled or the displayed value is already committed
    if (
      !hasTitle ||
      title === undefined ||
      displayedTitle === committedTitleRef.current
    ) {
      return;
    }

    committedTitleRef.current = displayedTitle;

    // Skip the node update while the user is editing the title
    if (isSelectionInTitle(editor)) {
      return;
    }

    // External sync should not be undoable
    setTitleText(editor, displayedTitle, { saveHistory: false });
    lastTitleTextRef.current = displayedTitle;
  }, [editor, hasTitle, title, displayedTitle]);

  return { titleError, handleEditorChange, handleEditorBlur };
}
