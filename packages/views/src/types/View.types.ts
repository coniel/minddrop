export interface View {
  /**
   * A unique identifier for the view.
   */
  id: string;

  /**
   * A user defined name for the view.
   */
  name: string;

  /**
   * The type of view. Must be a registered view type.
   */
  type: string;

  /**
   * The ID of the query used to populate the view if it is a query view.
   */
  query?: string;
}
