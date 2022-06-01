import { RTFragment } from './RTFragment.types';
import {
  FieldValueArrayFilter,
  FieldValueArrayUnion,
  FieldValueArrayRemove,
} from '@minddrop/utils';
import { TRDTypeData, TypedResourceDocument } from '@minddrop/resources';
import { RTNode } from '.';

export interface BaseRTElementData {
  /**
   * The element level.
   */
  level: 'inline' | 'block';

  /**
   * An array of rich text nodes and the IDs of inline rich
   * text elements which make up the element's rich text
   * content.
   */
  children?: (RTNode | string)[];

  /**
   * The IDs of nested block level `RTElements`. Only present
   * on block level elements which support nesting.
   */
  nestedElements?: string[];
}

/**
 * Base data supplied when creating a rich text element.
 */
export interface BaseCreateRTElementData {
  /**
   * The rich text content of the element.
   */
  children?: RTFragment;
}

/**
 * Base data supplied when updating a rich text element.
 */
export interface BaseUpdateRTElementData {
  /**
   * An array of `RichText` nodes and inline `RTElement`s,
   * which make up the element's rich text content.
   */
  children?: RTFragment | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * The IDs of nested block level `RTElements`. Only present
   * on block level elements which support nesting.
   */
  nestedElements?:
    | string[]
    | FieldValueArrayUnion
    | FieldValueArrayFilter
    | FieldValueArrayRemove;
}

/**
 * Changes that can be applied to an inline rich text element's fields.
 */
export interface RTElementChanges {
  /**
   * The element type identifier, e.g. 'link'.
   */
  type?: string;

  /**
   * An array of `RichText` nodes and inline `RTElement`s,
   * which make up the element's rich text content.
   */
  children?: RTFragment | FieldValueArrayUnion | FieldValueArrayFilter;

  /**
   * The IDs of nested block level `RTElements`. Only present
   * on block level elements which support nesting.
   */
  nestedElements?:
    | string[]
    | FieldValueArrayUnion
    | FieldValueArrayFilter
    | FieldValueArrayRemove;
}

export type RTElementTypeData = TRDTypeData<BaseRTElementData>;

export type RTElement<TTypeData extends TRDTypeData<BaseRTElementData> = {}> =
  TypedResourceDocument<BaseRTElementData, TTypeData>;

export type RTInlineElement<
  TTypeData extends TRDTypeData<BaseRTElementData> = {},
> = Omit<RTElement<TTypeData>, 'level' | 'nestedElements'> & {
  level: 'inline';
};

export type RTBlockElement<
  TTypeData extends TRDTypeData<BaseRTElementData> = {},
> = Omit<RTElement<TTypeData>, 'level'> & {
  level: 'block';
};

/**
 * A { [id]: RTElement } map of rich text elements.
 */
export type RTElementMap<TTypeData extends RTElementTypeData = {}> = Record<
  string,
  RTElement<TTypeData>
>;
