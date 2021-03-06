import {
  ResourceTypeConfig,
  RegisteredResourceTypeConfig,
} from '@minddrop/resources';
import { HtmlDeserializerMap } from './HtmlDeserializer.types';
import { RTFragment } from './RTFragment.types';
import { RTInlineElementProps } from './RTElementProps.types';
import {
  RTElementDocumentTypeData,
  BaseRTElementDocumentData,
} from './RTElementDocument.types';
import { RTElement, BaseRTElementData } from './RTElement.types';

interface RTInlineElementConfigOptions<
  TTypeData extends RTElementDocumentTypeData = {},
> {
  /**
   * The level at which the element is rendered, always 'inline'.
   */
  level: 'inline';

  /**
   * The component used to render the element.
   */
  component: React.ElementType<RTInlineElementProps<RTElement<TTypeData>>>;

  /**
   * Called when creating a new element of this type. Should return an object
   * containing the initial state of the custom data used in the element.
   * Omit if the element does not use custom data.
   *
   * If there is a selection in the editor when the element is created (e.g.
   * the user selects text and presses the element's creation hotkey), the
   * `fragment` parameter will contain the selected `RichText` nodes and inline
   * `RTElement`s in the selection. These will automatically be set as the
   * element's `children` field.
   *
   * @param fragment The text fragment selected in the editor.
   */
  initializeData?(
    fragment?: RTFragment,
  ): TTypeData & Partial<BaseRTElementData>;

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
   * The hotkeys related to this element type.
   */
  hotkey?: string[];

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

  /**
   * HTML deserializers are called when HTML text is inserted into the editor.
   *
   * A { [node name]: HtmlDeserializer } map where [node name] corresponds to an
   * HTML element node name (in all caps), such a SPAN, A, IMG, etc.
   *
   * Use an asterisk (*) as the node name in order to match afainst all HTML
   * element types.
   */
  htmlDeserializers?: HtmlDeserializerMap;
}

export type RTInlineElementConfig<
  TTypeData extends RTElementDocumentTypeData = {},
> = ResourceTypeConfig<
  BaseRTElementDocumentData,
  TTypeData,
  RTInlineElementConfigOptions<TTypeData>
>;

export type RegisteredRTInlineElementConfig<
  TTypeData extends RTElementDocumentTypeData = {},
> = RegisteredResourceTypeConfig<
  BaseRTElementDocumentData,
  TTypeData,
  RTInlineElementConfigOptions<TTypeData>
>;
