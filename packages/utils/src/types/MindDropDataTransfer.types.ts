export type MindDropDataTransferAction =
  | 'insert'
  | 'copy'
  | 'cut'
  | 'move'
  | 'add'
  | 'sort';

export interface MindDropDataTransfer {
  /**
   * The action which led to the data insert.
   * - `insert`: external data (such as files or text) inserted into the app
   * - `copy`: internal data (such as drops) copied and pasted
   * - `cut`: internal data (such as drops) cut and pasted
   * - `move`: internal data (such as drops) dragged and dropped from a different view with intent to move
   * - `add`: internal data (such as drops) dragged and dropped from a different view with intent to add
   * - `sort`: internal data (such as drops) dragged and dropped within the same view
   */
  action: MindDropDataTransferAction;

  /**
   * The types of text based data which were inserted.
   * The actual data is stored under the `data` key.
   *
   * Common types include:
   * - 'text/plain' if plain text was inserted.
   * - 'text/html' if HTML text was inserted.
   * - 'text/url' if a URL was inserted.
   * - 'minddrop/nodes' if nodes were inserted.
   */
  types: string[];

  /**
   * A `{ [type]: [data] }` map of the insereted text data.
   */
  data: Record<string, string>;

  /**
   * The inserted files. Only set if files were inserted.
   */
  files?: File[];
}
