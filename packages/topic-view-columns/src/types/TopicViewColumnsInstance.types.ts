import { AddDropsMetadata, TopicViewInstance } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { UpdateViewInstanceData } from '@minddrop/views';

export interface ColumnItem {
  /**
   * The type of item, e.g. 'drop'.
   */
  type: string;

  /**
   * The item's ID.
   */
  id: string;
}

export type Columns = ColumnItem[][];

export interface TopicViewColumnsData {
  /**
   * The columns, stored as an array of ColumnItem arrays.
   */
  columns: Columns;
}

export interface TopicViewColumnsInstance
  extends TopicViewInstance,
    TopicViewColumnsData {}

export interface UpdateTopicViewColumnsInstanceData
  extends UpdateViewInstanceData {
  columns: FieldValue | TopicViewColumnsInstance['columns'];
}

export interface ColumnsAddDropsMetadata extends AddDropsMetadata {
  /**
   * The column number into which the drops were inserted.
   */
  column: number;

  /**
   * The index at which the drops were inserted into the column.
   * `null` if inserted at the end.
   */
  index: number;
}
