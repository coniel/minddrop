import { EventListenerCallback } from './EventListener.types';

export interface Core {
  /**
   * Adds an event listener for the specified event.
   *
   * @param type The event type to listen to.
   * @param callback The callback fired when an even occurs.
   */
  addEventListener(
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Removes an event listener.
   *
   * @param type The event listener type.
   * @param callback The event listener callback.
   */
  removeEventListener(
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Removes all of the source's event listeners.
   */
  removeAllEventListeners(): void;

  /**
   * Dispatches an event.
   *
   * @param type The event type.
   * @param data The data associated with the event.
   */
  dispatch(type: string, data?: any): void;
}
