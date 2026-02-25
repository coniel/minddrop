import { EventListenerCallback } from './EventListenerCallback.types';
import { EventListenerMap } from './EventListenerMap.types';

export interface EventsApi {
  /**
   * All registered event listeners.
   */
  listeners: EventListenerMap;

  /**
   * Adds the listener function to the **end** of the listeners array for
   * the event named `eventName`.
   *
   * Does not add the listener if an event listener with the same ID
   * is already registered.
   *
   * @param eventName - The name of the event to listen for.
   * @param listenerId - The ID of the listener which is being added.
   * @param callback - The  callback function.
   * @param once - When `true`, the listener is removed when triggered.
   */
  on<TData = unknown>(
    eventName: string,
    listenerId: string,
    callback: EventListenerCallback<TData>,
    once?: boolean,
  ): void;
  addListener<TData = unknown>(
    eventName: string,
    listenerId: string,
    callback: EventListenerCallback<TData>,
    once?: boolean,
  ): void;

  /**
   * Adds the listener function to the **beginning** of the listeners array for
   * the event named `eventName`.
   *
   * Does not add the listener if an event listener with the same ID
   * is already registered.
   *
   * @param eventName - The name of the event to listen for.
   * @param listenerId - The ID of the listener which is being added.
   * @param callback - The  callback function.
   * @param once - When `true`, the listener is removed when triggered.
   */
  prependListener(
    eventName: string,
    listenerId: string,
    callback: EventListenerCallback,
    once?: boolean,
  ): void;

  /**
   * Adds the listener function to the index immediately **before** the specified
   * listener in the listeners array for the event named `eventName`.
   *
   * Does not add the listener if `afterListenerId` is not a registered listener
   * or if the listener is already registered.
   *
   * @param eventName - The name of the event to listen for.
   * @param beforeListenerId - The ID of the event listener before which to add this one.
   * @param listenerId - The ID of the listener which is being added.
   * @param callback - The  callback function.
   * @param once - When `true`, the listener is removed when triggered.
   */
  addListenerBefore(
    eventName: string,
    beforeListenerId: string,
    listenerId: string,
    callback: EventListenerCallback,
    once?: boolean,
  ): void;

  /**
   * Adds the listener function to the index immediately **after** the specified
   * listener in the listeners array for the event named `eventName`.
   *
   * Does not add the listener if `afterListenerId` is not a registered listener
   * or if the listener is already registered.
   *
   * @param eventName - The name of the event to listen for.
   * @param afterListenerId - The ID of the event listener after which to add this one.
   * @param listenerId - The ID of the listener which is being added.
   * @param callback - The  callback function.
   * @param once - When `true`, the listener is removed when triggered.
   */
  addListenerAfter(
    eventName: string,
    afterListenerId: string,
    listenerId: string,
    callback: EventListenerCallback,
    once?: boolean,
  ): void;

  /**
   * Checks whether a listener with ID `listenerId` exists in the listeners array
   * for the event named `eventName`.
   *
   * @param eventName - The name of the event on which to check.
   * @param listenerId - The ID of the listener to check for.
   */
  hasListener(eventName: string, listenerId: string): boolean;

  /**
   * Removes the listener with ID `listenerId` from the listeners array for the
   * event named `eventName`.
   *
   * @param eventName - The name of the event from which to remove the listener.
   * @param listenerId - The ID of the listener to remove.
   */
  removeListener(eventName: string, listenerId: string): void;

  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   *
   * Asynchronously calls each of the side effects registered for the event named `eventName`,
   * passing the supplied arguments to each.
   *
   * @param eventName - The name of the event.
   * @param data - The data associated with the event.
   */
  dispatch<TData = unknown>(eventName: string, data?: TData): Promise<void>;

  /**
   * Clears all event listeners.
   *
   * **Intended for use in test only!**
   */
  _clearAll(): void;
}
