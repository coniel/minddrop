import { PropertyFilter } from '@minddrop/properties';

/**
 * Filter options available on every data view type, merged into
 * the view type's own options.
 */
export interface DataViewFilterOptions {
  /**
   * The filters an entry must all match to be shown. Defaults to
   * none.
   */
  filters?: PropertyFilter[];
}
