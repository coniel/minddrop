import { RichTextBlockElement, RichTextBlockElementProps } from '../../types';

export interface ToDoElementData {
  /**
   * `true` when the item is checked.
   */
  done: boolean;
}

export type ToDoElement = RichTextBlockElement<ToDoElementData>;

export type ToDoElementProps = RichTextBlockElementProps<ToDoElement>;
