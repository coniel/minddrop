export interface TopicFilters {
  /**
   * Include active topics (topics which are not deleted).
   */
  active?: boolean;

  /**
   * Include deleted topics.
   */
  deleted?: boolean;

  /**
   * Include hidden topics.
   */
  hidden?: boolean;
}
