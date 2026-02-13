export interface View<TViewOptions extends object = {}> {
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
   * Additional options for the view.
   */
  options?: TViewOptions;

  /**
   * The ID of the query used to populate the view if it is a query view.
   */
  query?: string;

  /**
   * A [database id]:[design id] mapping of the designs to use for elements
   * from the specified database.
   *
   * If not provided, the default designs will be used.
   *
   * Only applies to views that display elements using database designs.
   */
  designs?: Record<string, string>;

  /**
   * A [element id]:[design id] mapping of the design to use for the specified
   * element. Overrides the designs property for the specified element.
   *
   * Only applies to views that display elements using database designs.
   */
  designOverrides?: Record<string, string>;
}
