import { Editor } from './Editor.types';

export interface EditorShortcutContext {
  /**
   * Opens what a wikilink references. Absent when the editor's consumer does
   * not resolve references.
   */
  onOpenWikilink?: (reference: string) => void;
}

export interface EditorShortcut {
  /**
   * The keystroke which runs the shortcut, in hotkey notation, e.g.
   * `mod+enter`. Matched by key rather than by code, so that a shortcut
   * means the same thing on every keyboard layout.
   */
  hotkey: string;

  /**
   * Whether the shortcut also runs in a read-only editor. Only shortcuts
   * which do not change the document can.
   *
   * @default false
   */
  readOnly?: boolean;

  /**
   * Runs the shortcut.
   *
   * Returning false leaves the keystroke to whatever else wants it, which is
   * how a shortcut declines a keystroke it cannot act on, such as one which
   * follows a link when the cursor is not in one.
   *
   * @param editor - The editor the shortcut was pressed in.
   * @param context - What the editor's consumer provides the shortcut with.
   * @returns Whether the keystroke was consumed.
   */
  run(editor: Editor, context: EditorShortcutContext): boolean;
}
