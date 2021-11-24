import { EventListenerCallback } from './EventListener.types';

export interface Core {
  /**
   * Adds an event listener for the specified event.
   *
   * @param source The ID of the extension adding the event listener.
   * @param type The event type to listen to.
   * @param callback The callback fired when an even occurs.
   */
  addEventListener(
    source: string,
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Removes an event listener.
   *
   * @param source The ID of the extension removing the event listener.
   * @param type The event listener type.
   * @param callback The event listener callback.
   */
  removeEventListener(
    source: string,
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Dispatches an event.
   *
   * @param source The ID of the extension dispatching the event.
   * @param type The event type.
   * @param data The data associated with the event.
   */
  dispatch(source: string, type: string, data: any): void;
}
