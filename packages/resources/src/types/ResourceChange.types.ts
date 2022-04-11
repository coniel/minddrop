export interface ResourceChange<R, C> {
  /**
   * The resource data before it was changed.
   */
  before: R;

  /**
   * The resource data after it was changed.
   */
  after: R;

  /**
   * The changes applied to the resource data.
   */
  changes: C;
}
