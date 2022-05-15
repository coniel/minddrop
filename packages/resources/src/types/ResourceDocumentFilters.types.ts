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

export interface TypedResourceDocumentFilters extends ResourceDocumentFilters {
  /**
   * Include only resources documents of the given types.
   */
  type?: string;
}
