export interface DropTypeConfigFilters {
  /**
   * Filter by extension ID, including only drop configs
   * which were added by the given extensions.
   */
  extension?: string[];

  /**
   * Filter by drop type, including only drop configs of
   * the given drop types.
   */
  type?: string[];
}
