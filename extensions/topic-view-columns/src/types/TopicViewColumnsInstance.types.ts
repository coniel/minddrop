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

export interface Column {
  /**
   * A universaliy unique ID.
   */
  id: string;

  /**
   * The column's contents.
   */
  items: ColumnItem[];
}

export type Columns = Column[];

export interface TopicViewColumnsData {
  /**
   * The columns;
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

export interface InsertIntoColumnMetadata extends AddDropsMetadata {
  /**
   * The action to perform:
   * - 'insert-into-column' inserts data into an existing column
   * - 'create-column' create a new column and inserts data into it
   */
  action: 'insert-into-column';

  /**
   * The column number into which the drops were inserted.
   */
  column: number;

  /**
   * The index at which the drops were inserted into the column.
   */
  index: number;
}

export interface CreateColumnMetadata extends AddDropsMetadata {
  /**
   * The action to perform.
   */
  action: 'create-column';

  /**
   * The column number into which the drops were inserted.
   */
  column: number;
}

export type ColumnsAddDropsMetadata =
  | InsertIntoColumnMetadata
  | CreateColumnMetadata;
