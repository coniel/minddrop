export interface SubviewDescriptor {
  /**
   * The id of the entity the view currently shows within itself
   * (e.g. the selected data view in the data views list).
   */
  id: string;

  /**
   * Display title of the subview, shown in the view's tab and
   * breadcrumb trail.
   */
  title?: string;

  /**
   * Display icon of the subview as a serializable icon string, shown
   * in the view's tab and breadcrumb trail.
   */
  icon?: string;
}
