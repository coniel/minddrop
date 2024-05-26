import { BlockElement, BlockElementProps } from '../../types';

export interface ToDoElementData {
  /**
   * `true` when the item is checked.
   */
  done: boolean;
}

export type ToDoElement = BlockElement<ToDoElementData>;

export type ToDoElementProps = BlockElementProps<ToDoElement>;
