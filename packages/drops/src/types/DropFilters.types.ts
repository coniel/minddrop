export interface DropFilters {
  /**
   * Only include drops of the specified types.
   */
  type?: string[];

  /**
   * Include active drops (drops which are not archived,
   * deleted, nor hidden).
   */
  active?: boolean;

  /**
   * Include archived drops.
   */
  archived?: boolean;

  /**
   * Include deleted drops.
   */
  deleted?: boolean;
}
