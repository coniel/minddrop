/**
 * Whether a data view's entries are sorted by one of their
 * properties or by their metadata.
 */
export type DataViewSortBy = 'property' | 'metadata';

/**
 * The direction in which a data view's entries are sorted.
 */
export type DataViewSortDirection = 'ascending' | 'descending';

/**
 * Sort options available on every sortable data view type,
 * merged into the view type's own options.
 */
export interface DataViewSortOptions {
  /**
   * What the entries are sorted by. Defaults to 'metadata'.
   */
  sortBy?: DataViewSortBy;

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
  sortDirection?: DataViewSortDirection;
}
