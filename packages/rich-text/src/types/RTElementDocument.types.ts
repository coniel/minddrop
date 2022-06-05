import {
  BaseRTElementData,
  RTElementChanges,
  BaseCreateRTElementData,
  BaseUpdateRTElementData,
} from './RTElement.types';
import { RTNode } from './RTNode.types';
import { FieldValueArrayFilter, FieldValueArrayUnion } from '@minddrop/utils';
import { TRDTypeData, TypedResourceDocument } from '@minddrop/resources';

export interface BaseRTElementDocumentData
  extends Omit<BaseRTElementData, 'children'> {
  /**
   * An array of rich text nodes and the IDs of inline rich
   * text elements which make up the element's rich text
   * content.
   */
  children?: (RTNode | string)[];
}

/**
 * Changes that can be applied to an inline rich text element's fields.
 */
export interface BaseCreateRTElementDocumentData
  extends Omit<BaseCreateRTElementData, 'children'> {
  /**
   * An array of `RichText` nodes and inline `RTElement`s,
   * which make up the element's rich text content.
   */
  children?: (RTNode | string)[] | FieldValueArrayUnion | FieldValueArrayFilter;
}

/**
 * Changes that can be applied to an inline rich text element's fields.
 */
export interface BaseUpdateRTElementDocumentData
  extends Omit<BaseUpdateRTElementData, 'children'> {
  /**
   * An array of `RichText` nodes and inline `RTElement`s,
   * which make up the element's rich text content.
   */
  children?: (RTNode | string)[] | FieldValueArrayUnion | FieldValueArrayFilter;
}

/**
 * Changes that can be applied to an inline rich text element's fields.
 */
export interface RTElementDocumentChanges
  extends Omit<RTElementChanges, 'children'> {
  /**
   * An array of `RichText` nodes and inline `RTElement`s,
   * which make up the element's rich text content.
   */
  children?: (RTNode | string)[] | FieldValueArrayUnion | FieldValueArrayFilter;
}

export type RTElementDocumentTypeData = TRDTypeData<BaseRTElementDocumentData>;

export type RTElementDocument<
  TTypeData extends TRDTypeData<BaseRTElementDocumentData> = {},
> = TypedResourceDocument<BaseRTElementDocumentData, TTypeData>;

export type RTInlineElementDocument<
  TTypeData extends TRDTypeData<BaseRTElementDocumentData> = {},
> = Omit<RTElementDocument<TTypeData>, 'level' | 'nestedElements'> & {
  level: 'inline';
};

export type RTBlockElementDocument<
  TTypeData extends TRDTypeData<BaseRTElementDocumentData> = {},
> = Omit<RTElementDocument<TTypeData>, 'level'> & {
  level: 'block';
};

/**
 * A { [id]: RTElement } map of rich text elements.
 */
export type RTElementDocumentMap<
  TTypeData extends RTElementDocumentTypeData = {},
> = Record<string, RTElementDocument<TTypeData>>;
