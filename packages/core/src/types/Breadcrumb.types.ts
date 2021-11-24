export interface Breadcrumb {
  /**
   * The ID of the corresponding view.
   */
  view: string;

  /**
   * The view or resource name.
   */
  label: string;

  /**
   * The type of resource if the corresponding
   * view renders a resource (e.g. 'topic').
   */
  resourceType?: string;

  /**
   * The ID of the resource if the corresponding view renders a resource (e.g. Topic ID).
   */
  resourceId?: string;
}
