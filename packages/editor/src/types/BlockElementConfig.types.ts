import { Editor } from 'slate';
import {
  BlockElement,
  BlockElementTypeData,
  BlockElementProps,
} from './BlockElement.types';

export interface BlockElementConfig<
  TTypeData extends BlockElementTypeData = {},
> {
  /**
   * The level at which the element is rendered, always 'block'.
   */
  level: 'block';

  /**
   * The element type.
   */
  type: string;

  /**
   * The component used to render the element.
   */
  component: React.ElementType<BlockElementProps<BlockElement<TTypeData>>>;

  /**
   * Called when creating a new element of this type. Should return a BlockElement.
   *
   * Omit if the element does not use custom data.
   *
   * @returns A BlockElement.
   */
  initialize?(): BlockElement;

  /**
   * Called when an existing BlockElement of a different type is converted
   * into this type (e.g. converting a 'paragraph' element into an 'to-do'
   * element). Should return the converted BlockElement.
   *
   * Omit if the element does not need to perform additional logic during
   * element conversions.
   *
   * @param element - The element being converted.
   * @returns The converted element.
   */
  convert?(element: BlockElement): BlockElement;

  /**
   * A function which returns a plain text version of the element's content.
   * Omit if the element is non-void (in which case the `children` are converted
   * to plain text) or does not contain any text.
   *
   * @param element - The element to convert into plain text.
   * @returns The plain text string.
   */
  toPlainText?(element: BlockElement<TTypeData>): string;

  /**
   * A function which returns a markdown text version of the element's content.
   *
   * @param element - The element to convert into plain text.
   * @returns The markdown string.
   */
  toMarkdown?(element: BlockElement<TTypeData>): string;

  /**
   * Void elements are elements which do not involve text (e.g. an image
   * element), or elements in wich the text is not directly a part of the
   * editor (e.g. an equation element in which the equation expression
   * is edited in a popup field).
   *
   * Non-void elements must have a `children` field consisting of `Text`
   * nodes `InlineElement` nodes.
   */
  void?: boolean;

  /**
   * What happens when the Return key is pressed at the end of a BlockElement:
   * - `break-out` inserts a new element of the default type below (default).
   * - `same-type` inserts a new element of the same type as this one below.
   * - `line-break` inserts a soft line break into the current element.
   * - `callback` inserts a new element of the same type as this one below and
   *   calls the provided callback to update its data.
   */
  returnBehaviour?:
    | 'break-out'
    | 'line-break'
    | 'same-type'
    | ((element: BlockElement) => Partial<TTypeData>);

  /**
   * Markdown style shorcuts which trigger the creation of an element of
   * this type (e.g. '* ' to create a list item when typing a asterisk
   * followed by a space).
   *
   * The shortcut is only triggered if it was typed at the start of the
   * currently focused element. When triggered, calls the `convert` method
   * on the focused element. Therefor, shortcuts are only supported in elements
   * which allow conversion.
   *
   * The shortcut text is automatically removed when the shortcut is triggered.
   */
  shortcuts?: string[];

  /**
   * The hotkeys related to this element type.
   */
  hotkeys?: BlockHotkeyConfig[];
}

export interface BlockHotkeyConfig {
  /**
   * List of keys used to trigger the action.
   * Use 'Ctrl' for the Control/Command key.
   * Use 'Alt' from the Alt/Option key.
   * Use 'Shift' for the Shift key.
   */
  keys: string[];

  /**
   * The action triggered by the hotkey.
   *
   * Setting this to 'convert' will call the element's `convert` method
   * in order to convert to currently selected nodes(s) into this type.
   *
   * Setting this to a function will call the function only if the currently
   * focused node is of this element type. If the selection spans accross
   * multiple elements, the function is called on each node of this type.
   *
   * The function receives the editor instance and target element as parameters.
   */
  action: 'convert' | ((editor: Editor, element: BlockElement) => void);
}
