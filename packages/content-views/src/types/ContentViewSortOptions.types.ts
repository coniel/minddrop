/**
 * Whether a content view's entries are sorted by one of their
 * properties or by their metadata.
 */
export type ContentViewSortBy = 'property' | 'metadata';

/**
 * The direction in which a content view's entries are sorted.
 */
export type ContentViewSortDirection = 'ascending' | 'descending';

/**
 * Sort options available on every sortable content view type,
 * merged into the view type's own options.
 */
export interface ContentViewSortOptions {
  /**
   * What the entries are sorted by. Defaults to 'metadata'.
   */
  sortBy?: ContentViewSortBy;

  /**
   * The name of the sorted property, or the sorted metadata type
   * ('title', 'created' or 'last-modified') when sorting by
   * metadata. Metadata is referenced by type rather than by the
   * property name it is surfaced under, which is translated for
   * databases not declaring the property themselves. Defaults to
   * 'created'.
   */
  sortProperty?: string;

  /**
   * The direction in which the entries are sorted. Defaults to
   * 'descending', listing the newest entries first under the
   * default sort.
   */
  sortDirection?: ContentViewSortDirection;
}
