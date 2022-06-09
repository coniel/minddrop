import { RTFragment } from './RTFragment.types';
import {
  FieldValueArrayFilter,
  FieldValueArrayUnion,
  FieldValueArrayRemove,
} from '@minddrop/utils';
import { TRDTypeData, TypedResourceDocument } from '@minddrop/resources';

export interface BaseRTElementData {
  /**
   * The element level.
   */
  level: 'inline' | 'block';

  /**
   * A rich text fragment consisting of rich text nodes and
   * inline rich text elements.
   */
  children?: RTFragment;

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

export type UpdateRTElementData<
  TTypeUpdateData extends TRDTypeData<BaseRTElementData> = {},
> = BaseUpdateRTElementData & TTypeUpdateData;

/**
 * A { [id]: RTElement } map of rich text elements.
 */
export type RTElementMap<TTypeData extends RTElementTypeData = {}> = Record<
  string,
  RTElement<TTypeData>
>;
