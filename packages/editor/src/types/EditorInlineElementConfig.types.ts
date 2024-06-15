import { InlineElement } from '@minddrop/ast';
import { InlineElementProps } from './EditorInlineElementProps.types';

export interface EditorInlineElementConfig<
  TElement extends InlineElement = InlineElement,
> {
  /**
   * The AST block element type for which this config is used.
   */
  type: string;

  /**
   * Designates that the config is for an inline element.
   */
  display: 'inline';

  /**
   * The component used to render the element.
   */
  component: React.ElementType<InlineElementProps<TElement>>;

  /**
   * Called when creating a new element of this type. Should return an InlineElement.
   *
   * Omit if the element does not use custom data.
   *
   * @returns An InlineElement of this type.
   */
  initialize?(): InlineElement;

  /**
   * Designates that the config is for a void element.
   * Void elements are elements which do not involve text (e.g. an image
   * element), or elements in wich the text is not directly a part of the
   * editor (e.g. an equation element in which the equation expression
   * is edited in a popup field).
   */
  isVoid?: boolean;

  /**
   * The hotkeys related to this element type.
   *
   * - Use `'Ctrl'` for the Control key (maps to Command key on Mac)
   * - Use `'Alt'` from the Alt key (maps to the Option key on Mac).
   * - Use `'Shift'`for the Shift key.
   *
   * For other keys, simply use the character itslef (e.g. `'A'`, `'1'`, `'#'`).
   * These are case insensitive.
   */
  hotkeys?: string[][];

  /**
   * Markdown style shorcuts which trigger the creation of an element of
   * this type.
   *
   * Inline element shortcuts can be one of two types:
   * - A simple string, which triggers the shortcut as soon as it is typed
   * - A start-end combo, which is triggered when the `end` string is typed
   *   some time after the `start` string (e.g. '**bold text**' where both
   *   `start` and `end` are set to '**').
   *
   * When triggered, it calls the `initializeData` method and inserts the new element.
   * In the case of a start-end combo shortcut, the nodes between the two
   * shortcut strings will be set as the `initializeData` method's `fragment` parameter.
   *
   * The shortcut text is automatically removed when the shortcut is triggered.
   */
  shortcuts?: (string | { start: string; end: string })[];
}
