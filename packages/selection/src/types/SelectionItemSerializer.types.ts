import { SelectionItem } from './SelectionItem.types';

export interface SelectionItemSerializer<TData extends object = object> {
  /**
   * The type of selection items this serializer handles.
   */
  type: string;

  /**
   * Callback fired when the selection is copied or dragged.
   * Should return the item data serialized to a JSON string.
   *
   * If not provided, JSON.stringify will be used to serialize the item
   * data.
   *
   * @param items - The current selection items of this type to serialize.
   * @returns The serialized data.
   */
  toJsonString?(items: SelectionItem<TData>[]): string;

  /**
   * Callback fired when the selection is copied or dragged.
   * Should return the item data serialized to a plain text string.
   *
   * If not provided, no 'text/plain' data will be set in the
   * clipboard/data-transfer object.
   *
   * @param items - The current selection items of this type to serialize.
   * @returns The serialized data.
   */
  toPlainText?(items: SelectionItem<TData>[]): string;

  /**
   * Callback fired when the selection is copied or dragged.
   * Should return the item data serialized to an HTML string.
   *
   * If not provided, no 'text/html' data will be set in the
   * clipboard/data-transfer object.
   *
   * @param items - The current selection items of this type to serialize.
   * @returns The serialized data.
   */
  toHtml?(items: SelectionItem<TData>[]): string;

  /**
   * Callback fired when the selection is deleted.
   *
   * If not provided, no action will be taken when the selection is deleted.
   *
   * @param items - The current selection items of this type to delete.
   */
  delete?: (items: SelectionItem[]) => void;
}
