import { DropPosition } from './DropPosition.types';

export interface DragMoveData {
  /**
   * The horizontal position of the pointer in the viewport.
   */
  clientX: number;

  /**
   * The vertical position of the pointer in the viewport.
   */
  clientY: number;

  /**
   * The element under the pointer.
   */
  target: Element;

  /**
   * The position of the pointer relative to the drop target.
   */
  position: DropPosition;
}
