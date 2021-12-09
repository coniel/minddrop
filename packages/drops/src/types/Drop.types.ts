import { ContentColor } from '@minddrop/core';
import {
  FieldValueArrayRemove,
  FieldValueArrayUnion,
  FieldValueDelete,
} from '@minddrop/utils';

export interface Drop {
  /**
   * A universally unique ID.
   */
  id: string;

  /**
   * The drop type. Determines which component will be used to render it.
   */
  type: string;

  /**
   * Timestamp at which the drop was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the drop was last updated. Equal to the `createdAt`
   * value if the drop has not been updated.
   */
  updatedAt: Date;

  /**
   * The IDs of the tags applied to the drop.
   */
  tags?: string[];

  /**
   * The drop's markdown text content.
   */
  markdown?: string;

  /**
   * IDs of the drop's files. All files attached to the drop must be listed here.
   */
  files?: string[];

  /**
   * The drop's highlight color.
   */
  color?: ContentColor;

  /**
   * `true` if the drop is archived.
   */
  archived?: boolean;

  /**
   * Timestamp at which the drop was archived.
   * Only set if `archived` is `true`.
   */
  archivedAt?: Date;

  /**
   * `true` if the drop is  in the trash.
   */
  deleted?: boolean;

  /**
   * Timestamp at which the drop was deleted.
   * Only set if `deleted` is `true`.
   */
  deletedAt?: Date;
}

export interface GenerateDropData extends Partial<Drop> {
  type: string;
}

export interface CreateDropData {
  type: string;
  markdown?: string;
  color?: ContentColor;
  files?: string[];
  tags?: string[];
}

export interface UpdateDropData {
  type?: string;
  markdown?: string | FieldValueDelete;
  color?: ContentColor | FieldValueDelete;
}

export interface DropChanges {
  updatedAt: Date;
  type?: string;
  markdown?: string | FieldValueDelete;
  tags?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
  files?:
    | string[]
    | FieldValueDelete
    | FieldValueArrayUnion
    | FieldValueArrayRemove;
  color?: ContentColor | FieldValueDelete;
  archived?: true | FieldValueDelete;
  archivedAt?: Date | FieldValueDelete;
  deleted?: true | FieldValueDelete;
  deletedAt?: Date | FieldValueDelete;
}

export type DropMap = Record<string, Drop>;
