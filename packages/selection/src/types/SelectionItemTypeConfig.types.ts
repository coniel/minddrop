import { SelectionItem } from './SelectionItem.types';

export interface SelectionItemTypeConfig {
  /**
   * The ID of the serializer. This should be unique to the serializer.
   * It is used to identify the serializer that should be used to
   * serialize the selection when it is copied, cut, or dragged.
   */
  id: string;

  /**
   * Callback fired when the selection is copied, cut, or dragged.
   * Should return the data to be set in the clipboard/data-transfer object.
   *
   * @param selection - The current selection items to serialize.
   * @returns Serialized selection data.
   */
  serializeData(selection: SelectionItem[]): Record<string, string>;

  /**
   * Callback fired when the selection is deleted or cut.
   *
   * @param items - The selection items to delete.
   */
  onDelete: (items: SelectionItem[]) => void;
}
