import {
  ResourceTypeConfig,
  RegisteredResourceTypeConfig,
} from '@minddrop/resources';
import { DataInsert } from '@minddrop/core';
import { Editor } from 'slate';
import {
  RTBlockElement,
  RTElement,
  BaseRTElementData,
} from './RTElement.types';
import { RTBlockElementProps } from './RTElementProps.types';
import { HtmlDeserializerMap } from './HtmlDeserializer.types';
import {
  RTElementDocumentTypeData,
  BaseRTElementDocumentData,
} from './RTElementDocument.types';

interface RTBlockElementConfigOptions<
  TTypeData extends RTElementDocumentTypeData = {},
> {
  /**
   * The level at which the element is rendered, always 'block'.
   */
  level: 'block';

  /**
   * The component used to render the element.
   */
  component: React.ElementType<RTBlockElementProps<RTElement<TTypeData>>>;

  /**
   * Called when creating a new element of this type. Should return an object
   * containing the initial state of the custom data used in the element.
   * Omit if the element does not use custom data.
   *
   * If the element is being created as the result of a data insert (such as a
   * paste event), the `data` parameter will contain the inserted data.
   *
   * @param data A data insert object.
   */
  initializeData?(data?: DataInsert): TTypeData & Partial<BaseRTElementData>;

  /**
   * Called when an existing rich text element of a different type is converted
   * into this type (e.g. converting a 'paragraph' element into an 'equation'
   * element). Should return an object containing the initial state of custom
   * data used in the element.
   *
   * Omit if the element does not need to perform additional logic during
   * element conversions.
   *
   * @param element The element being converted.
   */
  convertData?(element: RTBlockElement): TTypeData;

  /**
   * A function which returns a plain text version of the element's content.
   * Omit if the element is non-void (in which case the `children` are converted
   * to plain text) or does not contain any text.
   *
   * @param element The element to convert into plain text.
   */
  toPlainText?(element: RTElement<TTypeData>): string;

  /**
   * Void elements are elements which do not involve text (e.g. an image
   * element), or elements in wich the text is not directly a part of the
   * editor (e.g. an equation element in which the equation expression
   * is edited in a popup field).
   *
   * Non-void elements must have a `children` field consisting of `RichText`
   * nodes and inline `RTElement`s.
   */
  void?: boolean;

  /**
   * Whether other block level elements can indented below this one. Indented
   * block IDs will be set as the element's `nestedElements` parameter.
   */
  allowNesting?: boolean;

  /**
   * What happens when the Return key is pressed at the end of a block element:
   * - `break-out` inserts a new element of the default type below (default).
   * - `same-type` inserts a new element of the same type as this one below.
   * - `line-break` inserts a soft line break into the current element.
   */
  returnBehaviour?: 'break-out' | 'line-break' | 'same-type';

  /**
   * The data types from which this kind of element can be created (e.g.
   * 'text/plain'). Used to decide which type of element to create when data
   * is inserted into the editor (e.g. from a paste event).
   *
   * When a data insert contains a matching data type, the `initializeData` method will
   * be called with the inserted data. If there are multiple registered rich text
   * element types that support the same data type, only a single element will be
   * created (the element type that was registered first).
   *
   * Omit if this element type does not support being created from data.
   *
   * Note that 'text/html' data is ommited as creating elements from HTML is
   * handled separately using `htmlDeserializers`.
   */
  dataTypes?: string[];

  /**
   * The file types from which this kind of element can be created (e.g.
   * 'image/png'). Used to decide which type of element to create when data
   * containing files is inserted into the editor (e.g. from a paste event).
   *
   * When a data insert contains a matching file type, the `initializeData` method will
   * be called with the inserted file(s). If there are multiple registered rich
   * text element types that support the same file type, only a single element
   * will be created (the element type that was registered first).
   *
   * Omit if this element type does not support files.
   */
  fileTypes?: string[];

  /**
   * Determnies the behaviour when creating elements of this type from files.
   *
   * When `true`, indicates that this element type supports multiple
   * files at once, resulting in the config's `initializeData` method being called
   * once with all supported files included in the `data` parameter.
   *
   * When `false`, indicates that this element type only supports a single
   * file per element. In this case, the `initializeData` method will called for each
   * inserted file, with a signle file being included in the `data` parameter.
   */
  multiFile?: boolean;

  /**
   * The domains from which this type of element can be created. Used to decide
   * which type of element to create when a URL is inserted into the editor.
   *
   * Values can be either domains, such as 'minddrop.app' (which also matches
   * 'www.minddrop.app'), 'docs.minddrop.app' to match a specific subdomain,
   * '*.minddrop.app' to match any subdomain, or 'minddrop.*' to match any TLD.
   *
   * For more control over the matching, a function can be provided which receives
   * the URL and returns a boolean indicating a match.
   */
  domains?: (string | ((url: string) => boolean))[];

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

  /**
   * A { [node name]: HtmlDeserializer } map where [node name] corresponds to an
   * HTML element node name (in all caps), such a DIV, P, IMG, etc.
   *
   * Use an asterisk (*) as the node name in order to match afainst all HTML
   * element types.
   *
   * HTML deserializers are called when HTML text is inserted into the editor.
   */
  htmlDeserializers?: HtmlDeserializerMap;
}

export type RTBlockElementConfig<
  TTypeData extends RTElementDocumentTypeData = {},
> = ResourceTypeConfig<
  BaseRTElementDocumentData,
  TTypeData,
  RTBlockElementConfigOptions<TTypeData>
>;

export type RegisteredRTBlockElementConfig<
  TTypeData extends RTElementDocumentTypeData = {},
> = RegisteredResourceTypeConfig<
  BaseRTElementDocumentData,
  TTypeData,
  RTBlockElementConfigOptions<TTypeData>
>;

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
  action: 'convert' | ((editor: Editor, element: RTBlockElement) => void);
}
