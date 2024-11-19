export interface SelectionItem {
  /**
   * Callback fired when the item is dragged, copied, or cut.
   * Should return a plain text version of the item's content if
   * applicable.
   */
  getPlainTextContent?(): string;

  /**
   * Callback fired when the item is dragged, copied, or cut.
   * Should return HTML text version of the item's content if
   * applicable.
   */
  getHtmlTextContent?(): string;

  /**
   * Callback fired when the item is dragged, copied, or cut.
   * Should return the files associated with the item if applicable.
   */
  getFiles?(): File[];

  /**
   * Callback fired when the item is dragged, copied, or cut.
   * Should return URIs associated with the item if applicable.
   */
  getUriList?(): string[];

  /**
   * Callback fired when the item is dragged, copied, or cut.
   * Should return a JSON serterializable object with the item's data.
   */
  getData?(): Record<string, any>;

  /**
   * Callback fired when the Delete or Backspace key is pressed
   * while the item is selected.
   */
  onDelete?(): void;

  /**
   * A unique identifier for the item, usful for checking if the item is
   * in the current selection.
   */
  id: string;
}
