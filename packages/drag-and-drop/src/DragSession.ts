import { AutoScroll } from '@minddrop/utils';

export interface DragSessionState {
  /**
   * The element standing in for the drag.
   */
  previewElement: Element;

  /**
   * The keys of the drop targets the drag is over, innermost first.
   */
  overKeys: string[];

  /**
   * The scroll containers around the elements the pointer has been
   * over, cached by element.
   */
  scrollables: Map<Element, HTMLElement[]>;

  /**
   * The scroll containers the drag has been over, most recently hit
   * first. Starts as those around the drag's source.
   */
  visitedScrollables: HTMLElement[];

  /**
   * The scroll to apply on the next frame.
   */
  autoScroll: AutoScroll;

  /**
   * The scheduled auto-scroll frame, null while idle.
   */
  scrollFrame: number | null;

  /**
   * Removes the window listeners driving the drag.
   */
  removeListeners: VoidFunction;
}

/**
 * The package's state for the drag in progress. Kept outside the
 * store since none of it is rendered.
 */
export const DragSession: { current: DragSessionState | null } = {
  current: null,
};
