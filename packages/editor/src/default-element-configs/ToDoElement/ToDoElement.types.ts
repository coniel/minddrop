import { BlockElement, BlockElementProps } from '../../types';

export interface ToDoElementData {
  /**
   * `true` when the item is checked.
   */
  done: boolean;

  /**
   * The nesting level of the to-do item.
   */
  nestingLevel?: number;
}

export type ToDoElement = BlockElement<ToDoElementData>;

export type ToDoElementProps = BlockElementProps<ToDoElement>;
