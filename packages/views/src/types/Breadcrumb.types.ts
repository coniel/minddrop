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
   * How many entries back in the tab's history the crumb sits.
   * Crumbs of the view currently shown carry none, and are rendered
   * as plain labels.
   */
  steps?: number;
}
