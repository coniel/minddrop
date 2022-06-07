import { ResourceReference } from '@minddrop/resources';
import { AddDropsMetadata, TopicViewInstance } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';

export interface Column {
  /**
   * A universaliy unique ID.
   */
  id: string;

  /**
   * The column's contents.
   */
  items: ResourceReference[];
}

export type Columns = Column[];

export interface TopicViewColumnsData {
  /**
   * The columns;
   */
  columns: Columns;
}

export type TopicViewColumnsInstance = TopicViewInstance<TopicViewColumnsData>;

export interface UpdateTopicViewColumnsInstanceData {
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
