import { TextBlockElement } from '../../types';

export interface ToDoElementData {
  /**
   * The nesting level of the to-do list item.
   */
  depth?: number;

  /**
   * Whether the to-do list item is checked.
   */
  checked: boolean;
}

export type ToDoElement = TextBlockElement<'to-do', ToDoElementData>;
