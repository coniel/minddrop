export interface RTElementFilters {
  /**
   * Filters by the element level, returning only elements of the
   * given level.
   */
  level?: 'block' | 'inline';

  /**
   * Filter elements by type, returning only elements which match
   * one of the given types.
   */
  type?: string[];

  /**
   * Filter elements based on whether they are void elements. When
   * `true`, returns only void elements. When `false`, returns only
   * non-void elements. If omitted, returns both kinds of elements.
   */
  void?: boolean;

  /**
   * Filters elements based on whether they are deleted. When `true`,
   * returns only deleted elements. When `false`, returns only
   * elements which are not deleted. Omit to include both deleted and
   * non-deleted elements.
   */
  deleted?: boolean;
}
