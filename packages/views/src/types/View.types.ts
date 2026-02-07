export interface View {
  /**
   * A unique identifier for the view.
   */
  id: string;

  /**
   * The path to the view file.
   */
  path: string;

  /**
   * A user defined name for the view.
   */
  name: string;

  /**
   * The type of view.
   */
  type: string;

  /**
   * The view's content type:
   * - `entry`: The content stores a list of entry IDs.
   * - `query`: The content stores a list of query IDs used to fetch entries.
   */
  contentType: 'entry' | 'query';

  /**
   * The content of the view.
   */
  content: string[];

  /**
   * The date the view was created.
   */
  created: Date;

  /**
   * The date the view was last modified.
   */
  lastModified: Date;
}
