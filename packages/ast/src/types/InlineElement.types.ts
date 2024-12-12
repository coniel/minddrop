import { Fragment } from './Fragment.types';

export interface BaseInlineElement<TType extends string = string> {
  /**
   * The element type.
   */
  type: TType;

  /**
   * Designates the element as a inline level element.
   */
  display: 'inline';

  /**
   * The children of the element. Must be a fragment.
   *
   * Void elements should have a single empty TextElement child.
   */
  children: Fragment;
}

export interface BaseVoidInlineElement<TType extends string = string>
  extends Omit<BaseInlineElement<TType>, 'children'> {
  /**
   * Designates the element as a void element.
   * Void elements are elements which do not involve text (e.g. an image
   * element), or elements in wich the text is not directly a part of the
   * editor (e.g. an equation element in which the equation expression
   * is edited in a popup field).
   */
  isVoid: true;

  /**
   * Void elements always have a single empty TextElement child.
   */
  children: [{ text: '' }];
}

/**
 * Type specific data cannot use same keys as base data.
 */
export type InlineElementTypeData = object & {
  [K in keyof BaseVoidInlineElement]?: never;
};

export type TextInlineElement<
  TType extends string = string,
  TTypeData extends InlineElementTypeData = object,
> = BaseInlineElement<TType> & TTypeData;

export type VoidInlineElement<
  TType extends string = string,
  TTypeData extends InlineElementTypeData = object,
> = BaseVoidInlineElement<TType> & TTypeData;

export type InlineElement<
  TType extends string = string,
  TTypeData extends InlineElementTypeData = object,
> = TextInlineElement<TType, TTypeData> | VoidInlineElement<TType, TTypeData>;
