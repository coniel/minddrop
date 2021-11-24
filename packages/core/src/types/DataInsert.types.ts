export interface DataInsert {
  /**
   * The types of data which were inserted.
   *
   * Common types include:
   * - 'files' if files were inserted.
   * - 'text/plain' if plain text was inserted.
   * - 'text/html' if HTML text was inserted.
   */
  types: string[];

  /**
   * A [type]: [data] map of the insereted text data.
   */
  data: Record<string, string>;

  /**
   * The inserted files. Empty if no files were inserted.
   */
  files: File[];

  /**
   * The ID of the view into which the data was inserted.
   */
  view: string;

  /**
   * The ID of the resource the data was inserted into (such as topic).
   */
  resource?: string;
}
