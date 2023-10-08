import { Editor } from './Editor.types';

export type InlineShortcutAction = (editor: Editor) => void;

export type InlineShortcutWrapTrigger = { start: string; end: string };

export interface InlineShortcut {
  /**
   * Markdown style shorcuts which trigger the callback.
   *
   * Shortcuts can be one of two types:
   * - A simple string, which triggers the shortcut as soon as it is typed
   * - A start-end combo, which is triggered when the `end` string is typed
   *   some time after the `start` string (e.g. '**bold text**' where both
   *   `start` and `end` are set to '**').
   */
  triggers: (string | InlineShortcutWrapTrigger)[];

  /**
   * Callback fired when the shortcut is triggered.
   */
  action: InlineShortcutAction;
}
