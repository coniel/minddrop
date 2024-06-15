import { Fragment } from './Fragment.types';

export interface BaseBlockElement<TType extends string = string> {
  /**
   * The element type.
   */
  type: TType;

  /**
   * Designates the element as a block level element.
   */
  display: 'block';

  /**
   * The text content of the element.
   */
  children: Fragment;
}

export interface BaseContainerBlockElement<TType extends string = string>
  extends Omit<BaseBlockElement<TType>, 'children'> {
  /**
   * Designates the element as a container element.
   * Container elements contain other block level elements
   * as children.
   */
  isContainer: true;

  /**
   * The content of the element, always other block level elements.
   */
  children: BlockElement[];
}

export interface BaseVoidBlockElement<TType extends string = string>
  extends Omit<BaseBlockElement<TType>, 'children'> {
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
export type BlockElementTypeData = Object & {
  [K in keyof BaseVoidBlockElement]?: never;
};

export type TextBlockElement<
  TType extends string = string,
  TTypeData extends BlockElementTypeData = {},
> = BaseBlockElement<TType> & TTypeData;

export type ContainerBlockElement<
  TType extends string = string,
  TTypeData extends BlockElementTypeData = {},
> = BaseContainerBlockElement<TType> & TTypeData;

export type VoidBlockElement<
  TType extends string = string,
  TTypeData extends BlockElementTypeData = {},
> = BaseVoidBlockElement<TType> & TTypeData;

export type BlockElement<
  TType extends string = string,
  TTypeData extends BlockElementTypeData = {},
> =
  | TextBlockElement<TType, TTypeData>
  | ContainerBlockElement<TType, TTypeData>
  | VoidBlockElement<TType, TTypeData>;
