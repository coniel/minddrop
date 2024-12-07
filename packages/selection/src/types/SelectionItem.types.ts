export interface SelectionItem {
  /**
   * A unique identifier for the item, usful for checking if the item is
   * in the current selection.
   */
  id: string;

  /**
   * The ID of the SelectionSerializer that should be used to serialize
   * the item when it is copied, cut, or dragged.
   */
  type: string;

  /**
   * Callback used by the SelectionSerializer to get the item's data.
   * Only required if the specified serializer depends upon it.
   */
  getData?(): Record<string, any>;
}
