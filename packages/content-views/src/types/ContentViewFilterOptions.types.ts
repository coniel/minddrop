import { PropertyFilter } from '@minddrop/filters';

/**
 * Filter options available on every content view type, merged into
 * the view type's own options.
 */
export interface ContentViewFilterOptions {
  /**
   * The filters an entry must all match to be shown. Defaults to
   * none.
   */
  filters?: PropertyFilter[];
}
