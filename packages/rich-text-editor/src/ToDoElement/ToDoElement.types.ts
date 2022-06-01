import { RTBlockElement, RTBlockElementProps } from '@minddrop/rich-text';

export interface ToDoElement extends RTBlockElement {
  /**
   * The element type, always 'to-do'.
   */
  type: 'to-do';

  /**
   * `true` when the item is checked.
   */
  done: boolean;
}

export type ToDoElementProps = RTBlockElementProps<ToDoElement>;
