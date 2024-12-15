import { RenderLeafProps } from 'slate-react';
import { Element, Fragment } from '@minddrop/ast';
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
  key: string;

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

  /**
   * HTML deserializers are called when HTML text is inserted into the editor.
   *
   * A { [node name]: HtmlDeserializer } map where [node name] corresponds to an
   * HTML element node name (in all caps), such a SPAN, A, IMG, etc.
   *
   * Use an asterisk (*) as the node name in order to match afainst all HTML
   * element types.
   */
  htmlDeserializers?: Record<string, HtmlMarkDeserializer>;
}

/**
 * Function called to deserialize an HTML element into a mark.
 *
 * They should return the mark's value, such as `true`, or `null` the mark should not be applied.
 */
export type HtmlMarkDeserializer<
  THtmlElement extends HTMLElement = HTMLElement,
> = (
  element: THtmlElement,
  parent: HTMLElement | null,
  children: Fragment | Element[] | null,
) => boolean | string | number | null;
