export interface DocumentView {
  /**
   * A unique identifier for the view.
   */
  id: string;

  /**
   * The view type. Must be a registered view type.
   */
  type: string;

  /**
   * IDs of the blocks contained in the view. Only blocks that are
   * contained in the document may included in this list.
   */
  blocks: string[];
}
