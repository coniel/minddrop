import { Element } from '@minddrop/ast';
import { TranslationKey } from '@minddrop/i18n';
import { IconProp } from '@minddrop/ui-primitives';
import { BlockElementProps } from './EditorBlockElementProps.types';

export interface EditorBlockElementConfig<TElement extends Element = Element> {
  /**
   * The AST block element type for which this config is used.
   */
  type: string;

  /**
   * The component used to render the element.
   */
  component: React.ElementType<BlockElementProps<TElement>>;

  /**
   * Called when an existing block element of a different type is converted
   * into this type (e.g. converting a 'paragraph' element into a 'heading'
   * element). Should return the converted block element.
   *
   * Omit if the element does not need to perform additional logic during
   * element conversions.
   *
   * @param element - The element being converted.
   * @param shortcut- The shortcut text which triggered the conversion of the element if applicable.
   * @returns The converted element.
   */
  convert?(element: Element, shortcut?: string): TElement;

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
   * this type (e.g. '# ' to create a heading when typing a hash followed
   * by a space).
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
   * The entries listed in the block menu for this element type.
   * A type can list multiple entries when it supports variations
   * (e.g. heading levels).
   *
   * Omit to keep the element type out of the block menu.
   */
  menuItems?: BlockMenuItemConfig<TElement>[];
}

export interface BlockMenuItemConfig<TElement extends Element = Element> {
  /**
   * The translation key of the label displayed in the menu.
   */
  label: TranslationKey;

  /**
   * The translation key of the terms the entry is found by in addition to
   * its label, as a space separated list. Covers the names the construct
   * goes by elsewhere, so that searching for what it is called in markdown
   * or in another editor finds it.
   */
  keywords?: TranslationKey;

  /**
   * The icon displayed next to the label.
   */
  icon: IconProp;

  /**
   * Element data applied on top of the element type's initial
   * data when the entry is selected.
   */
  data?: Partial<TElement>;
}
