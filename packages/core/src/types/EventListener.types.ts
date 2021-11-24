export interface EventListenerPayload<T, D> {
  /**
   * The ID of the extension that dispatched the event.
   */
  source: string;

  /**
   * The event type.
   */
  type: T;

  /**
   * The data associated with the event.
   */
  data: D;
}

export type EventListenerCallback<T, D> = (
  payload: EventListenerPayload<T, D>,
) => void;

export interface EventListener {
  /**
   * The extension ID from which the event listener was added.
   */
  source: string;

  /**
   * The type of event to listen to.
   */
  type: string;

  /**
   * The callback fired when the event occurs.
   */
  callback: EventListenerCallback<string, any>;
}
