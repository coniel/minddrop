export interface SelectionItem<TData extends object = object> {
  /**
   * A unique identifier for the item, usful for checking if the item is
   * in the current selection.
   */
  id: string;

  /**
   * The type of item this is.
   */
  type: string;

  /**
   * The data associated with the item.
   */
  data?: TData;
}
