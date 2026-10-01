import { ActiveDrag } from './types';

export const DragStartedEvent = 'drag-and-drop:started';
export const DragEndedEvent = 'drag-and-drop:ended';

export type DragStartedEventData = ActiveDrag;

export type DragEndedEventData = {
  /**
   * The drag which ended.
   */
  drag: ActiveDrag;

  /**
   * Whether the drag ended in a drop on a target, rather than being
   * cancelled or released outside every target.
   */
  dropped: boolean;

  /**
   * The element of the drop target the drag dropped on, or null
   * when it did not drop.
   */
  target: HTMLElement | null;
};

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'drag-and-drop:started': DragStartedEventData;
    'drag-and-drop:ended': DragEndedEventData;
  }
}
