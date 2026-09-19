import { DroppableEntry } from '../DroppablesRegistry';
import { DropPosition } from './DropPosition.types';

export interface DropTarget {
  /**
   * The drop target.
   */
  entry: DroppableEntry;

  /**
   * Where the pointer sits relative to the target.
   */
  position: DropPosition;
}
