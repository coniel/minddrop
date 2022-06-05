import { RTBlockElement, RTBlockElementProps } from '@minddrop/rich-text';

export interface ToDoElementData {
  /**
   * `true` when the item is checked.
   */
  done: boolean;
}

export type ToDoElement = RTBlockElement<ToDoElementData>;

export type ToDoElementProps = RTBlockElementProps<ToDoElement>;
