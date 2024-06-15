import { Editor } from 'slate';
import { BlockElement } from '@minddrop/ast';
import { BlockElementProps } from './EditorBlockElementProps.types';

export interface EditorBlockElementConfig<
  TElement extends BlockElement = BlockElement,
> {
  /**
   * The AST block element type for which this config is used.
   */
  type: TElement['type'];

  /**
   * Designates that the config is for a block element.
   */
  display: 'block';

  /**
   * The component used to render the element.
   */
  component: React.ElementType<BlockElementProps<TElement>>;

  /**
   * Called when creating a new element of this type. Should return a BlockElement.
   *
   * Omit if the element does not use custom data.
   *
   * @returns A BlockElement.
   */
  initialize?(): TElement;

  /**
   * Called when an existing block element of a different type is converted
   * into this type (e.g. converting a 'paragraph' element into an 'to-do'
   * element). Should return the converted block element.
   *
   * Omit if the element does not need to perform additional logic during
   * element conversions.
   *
   * @param element - The element being converted.
   * @param shortcut- The shortcut text which triggered the conversion of the element if applicable.
   * @returns The converted element.
   */
  convert?(element: BlockElement, shortcut?: string): TElement;

  /**
   * Designates that the config is for a void element.
   * Void elements are elements which do not involve text (e.g. an image
   * element), or elements in wich the text is not directly a part of the
   * editor (e.g. an equation element in which the equation expression
   * is edited in a popup field).
   */
  isVoid?: boolean;

  /**
   * Designates the config is for a container element.
   * Container elements contain other block level elements
   * as children.
   */
  isContainer?: true;

  /**
   * Designates that other block elements can be nested below this element.
   * When an element has nested elements, the editor will automatically wrap
   * both the parent and child elements in a container element.
   */
  allowNesting?: boolean;

  /**
   * What happens when the Return key is pressed at the end of a BlockElement:
   * - `break-out` inserts a new element of the default type below (default).
   * - `same-type` inserts a new element of the same type as this one below.
   * - `line-break` inserts a soft line break into the current element.
   * - `callback` inserts the element returned by the callback function which
   *   receives the current element as a parameter.
   */
  returnBehaviour?:
    | 'break-out'
    | 'line-break'
    | 'same-type'
    | ((element: TElement) => Partial<TElement>);

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
  hotkeys?: BlockHotkeyConfig<TElement>[];
}

export interface BlockHotkeyConfig<
  TElement extends BlockElement = BlockElement,
> {
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
  action: 'convert' | ((editor: Editor, element: TElement) => void);
}
