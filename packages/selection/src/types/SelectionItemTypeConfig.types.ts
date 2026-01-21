import { SelectionItem } from './SelectionItem.types';

export interface SelectionItemTypeConfig<TData extends object = object> {
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
   * If not provided, the selection items themselves will be used as the data.
   *
   * @param items - The current selection items of this type to serialize.
   * @returns The data to be set in the clipboard/data-transfer object.
   */
  getData?(items: SelectionItem[]): TData[];
}
