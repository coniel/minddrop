export interface TopicFilters {
  /**
   * Include active topics (topics which are not archived,
   * deleted, nor hidden).
   */
  active?: boolean;

  /**
   * Include archived topics.
   */
  archived?: boolean;

  /**
   * Include deleted topics.
   */
  deleted?: boolean;

  /**
   * Include hidden topics.
   */
  hidden?: boolean;
}
