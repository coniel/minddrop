import isHotkey from 'is-hotkey';
import React, { useCallback, useMemo } from 'react';
import { EditorShortcuts } from '../EditorShortcuts';
import { Editor, EditorShortcutContext } from '../types';

/**
 * Applies the editor's keyboard shortcuts.
 *
 * @param editor An editor instance.
 * @param context What the editor's consumer provides the shortcuts with.
 * @param enabled Whether shortcuts which change the document may run.
 * @returns A key down handler, which returns whether the event was consumed.
 */
export function useEditorShortcuts(
  editor: Editor,
  context: EditorShortcutContext,
  enabled: boolean,
): (event: React.KeyboardEvent<HTMLDivElement>) => boolean {
  // Matched by key rather than by code, so that a shortcut means the same
  // thing on every keyboard layout
  const matchers = useMemo(
    () =>
      EditorShortcuts.map(
        (shortcut) =>
          [isHotkey(shortcut.hotkey, { byKey: true }), shortcut] as const,
      ),
    [],
  );

  return useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const match = matchers.find(
        ([matches, shortcut]) =>
          // A shortcut which changes the document is inert in a read-only
          // editor, but the keystroke is still that shortcut's, so no other
          // shortcut takes it
          (enabled || shortcut.readOnly) && matches(event.nativeEvent),
      );

      if (!match) {
        return false;
      }

      const consumed = match[1].run(editor, context);

      // A shortcut which declined the keystroke leaves it as it was, so
      // that whatever else wants it still receives it
      if (consumed) {
        event.preventDefault();
      }

      return consumed;
    },
    [editor, context, enabled, matchers],
  );
}
