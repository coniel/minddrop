import { TransferData } from '@minddrop/utils';
import { DragOrigin } from './DragOrigin.types';
import { DropPosition } from './DropPosition.types';

export interface DropEventData<TData = TransferData> {
  /**
   * The type of the element which received the drop.
   */
  targetType: string;

  /**
   * The ID of the element which received the drop.
   */
  targetId: string;

  /**
   * The index of the element which received the drop, if the target is
   * an item of a list.
   */
  index?: number;

  /**
   * The position of the drop, relative to the element receiving the drop.
   * 'before' and 'after' are only valid for items of a list. The value
   * is 'inside' when the target is not an item of a list.
   */
  position: DropPosition;

  /**
   * The data which was dropped, keyed by data type. MindDrop data
   * keys have their MIME type prefix and JSON suffix removed. Files
   * dropped from outside the app are under `files`.
   */
  data: TData;

  /**
   * Where the drag started from, or null when it started from no
   * place or from outside the app.
   */
  origin: DragOrigin | null;

  /**
   * The horizontal position of the pointer in the viewport at the
   * drop.
   */
  clientX: number;

  /**
   * The vertical position of the pointer in the viewport at the
   * drop.
   */
  clientY: number;
}
