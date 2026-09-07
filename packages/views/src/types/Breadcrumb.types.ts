export interface Breadcrumb {
  /**
   * The type of the view the crumb leads to, resolving its label and
   * icon when it carries none of its own.
   */
  view: string;

  /**
   * The unique id of the view instance the crumb leads to, when it
   * has one (e.g. a specific database's view).
   */
  viewId?: string;

  /**
   * The crumb's own display title, used by crumbs labelled by what
   * they show (e.g. a selected data view).
   */
  title?: string;

  /**
   * The crumb's own display icon as a serializable icon string.
   */
  icon?: string;

  /**
   * How many entries back in the tab's history the crumb sits, which
   * clicking it navigates back to. Absent on the crumb of the view
   * currently shown (the crumb preceding its subview in the trail),
   * which clicking clears the subview instead.
   */
  steps?: number;
}
