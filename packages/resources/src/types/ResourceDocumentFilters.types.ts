export interface ResourceDocumentFilters {
  /**
   * Include active documents (documents which are not deleted).
   */
  active?: boolean;

  /**
   * Include documents drops.
   */
  deleted?: boolean;
}
