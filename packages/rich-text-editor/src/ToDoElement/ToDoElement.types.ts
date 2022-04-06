import {
  RichTextBlockElement,
  RichTextBlockElementProps,
} from '@minddrop/rich-text';

export interface ToDoElement extends RichTextBlockElement {
  /**
   * The element type, always 'to-do'.
   */
  type: 'to-do';

  /**
   * `true` when the item is checked.
   */
  done: boolean;
}

export type ToDoElementProps = RichTextBlockElementProps<ToDoElement>;
