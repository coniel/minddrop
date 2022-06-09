import { ContentColor } from '@minddrop/core';
import {
  FieldValueArrayFilter,
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';
import {
  TRDTypeData,
  TypedResourceDocument,
  TRDUpdate,
} from '@minddrop/resources';

export interface DropBaseData {
  /**
   * The IDs of the tags applied to the drop.
   */
  tags?: string[];

  /**
   * The drop's highlight color.
   */
  color?: ContentColor;

  /**
   * The ID of the original drop from which this drop was created if
   * it is a duplicate drop. Only set if the drop was created through
   * duplication.
   */
  duplicatedFrom?: string;
}

export type DropTypeData = TRDTypeData<DropBaseData>;

export type Drop<TDropTypeData extends DropTypeData = {}> =
  TypedResourceDocument<DropBaseData, TDropTypeData>;

export type BaseGenerateDropData = Partial<Drop>;

export interface BaseCreateDropData {
  color?: ContentColor;
  tags?: string[];
}

export interface BaseUpdateDropData {
  color?: ContentColor | FieldValueDelete;
  tags?:
    | string[]
    | FieldValueArrayUnion
    | FieldValueArrayRemove
    | FieldValueArrayFilter;
}

export interface DropChanges {
  updatedAt: Date;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  color?: ContentColor | FieldValueDelete;
  deleted?: true | FieldValueDelete;
  deletedAt?: Date | FieldValueDelete;
  parents?: FieldValueArrayUnion | FieldValueArrayFilter;
}

export type DropUpdate<TTypeData = {}> = TRDUpdate<DropBaseData, TTypeData>;

export type DropMap<T extends Drop = Drop> = Record<string, T>;
