export type DropPosition = 'before' | 'after' | 'inside';

export interface DropEventData<TData = unknown> {
  /**
   * The drag event that triggered the drop.
   */
  event: React.DragEvent;

  /**
   * The type of the element which received the drop.
   */
  type: string;

  /**
   * The position of the drop, relative to the element receiving the drop.
   * 'before' and 'after' are only valid for items of a list. If the target
   * is not a list, the value will always be 'inside'.
   */
  position: DropPosition;

  /**
   * The data which was dropped.
   *
   * In the case of MindDrop data, the keys will have the MindDrop mime type
   * prefix and JSON suffixes removed.
   */
  data: TData;

  /**
   * The ID of the element which received the drop.
   */
  id?: string;

  /**
   * The index of the element which received the drop, if the target is
   * an item of a list.
   */
  index?: number;
}
