export interface DropFilters {
  /**
   * Only include drops of the specified types.
   */
  type?: string[];

  /**
   * Include active drops (drops which are not deleted).
   */
  active?: boolean;

  /**
   * Include deleted drops.
   */
  deleted?: boolean;
}
