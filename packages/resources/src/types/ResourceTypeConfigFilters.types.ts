export interface ResourceTypeConfigFilters {
  /**
   * Filter by extension ID, including only configs
   * which were added by the given extensions.
   */
  extension?: string[];

  /**
   * Filter by type, including only configs of the
   * given types.
   */
  type?: string[];
}
