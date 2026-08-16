import { RenderLeafProps } from 'slate-react';
import { MarkKey } from '@minddrop/ast';
import { TranslationKey } from '@minddrop/i18n';
import { IconProp } from '@minddrop/ui-primitives';
import { InlineShortcutWrapTrigger } from './InlineShortcut.types';

export interface MarkHotkey {
  /**
   * List of keys used to trigger the action.
   *
   * - Use `'Ctrl'` for the Control key (maps to Command key on Mac)
   * - Use `'Alt'` from the Alt key (maps to the Option key on Mac).
   * - Use `'Shift'`for the Shift key.
   *
   * For other keys, simply use the character itslef (e.g. `'A'`, `'1'`, `'#'`).
   * These are case insensitive.
   */
  keys: string[];

  /**
   * The value of the mark set onto the text node, defaults to `true`.
   */
  value?: boolean | string | number;
}

export interface MarkShortcut {
  /**
   * Mark shortcut triggers can be one of two types:
   * - A simple string, which toggles the mark on as soon as it is typed
   * - A start-end combo, which applies the mark to the text wrapped
   *   between the start and end triggers.
   *
   * The shortcut text is automatically removed when the shortcut is triggered.
   */
  trigger: string | InlineShortcutWrapTrigger;

  /**
   * The value of the mark set onto the text node, defaults to `true`.
   */
  value?: boolean | string | number;
}

export interface MarkConfig {
  /**
   * The key of the field added to the `Text` node when the formatting is
   * applied. Formatting is applied to a text node if the node has this
   * key set to a truthy value, e.g: `bold: true`
   */
  key: MarkKey;

  /**
   * The translation key of the mark's name, used to label the control which
   * applies it.
   */
  label: TranslationKey;

  /**
   * The icon of the control which applies the mark.
   */
  icon: IconProp;

  /**
   * The component used to render the mark. Wraps the editable span
   * element containing the text.
   */
  component: React.ElementType<RenderLeafProps>;

  /**
   * The hotkeys which toggle this mark.
   */
  hotkeys?: MarkHotkey[];

  /**
   * Markdown style shorcuts which enable this mark.
   *
   */
  shortcuts?: MarkShortcut[];
}
