import { EventData, EventName } from './EventDataMap.types';
import { EventListenerCallback } from './EventListenerCallback.types';
import { EventListenerCallbackMap } from './EventListenerCallbackMap.types';
import { EventListenerMap } from './EventListenerMap.types';
import { EventLogEntry } from './EventLogEntry.types';

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
  on<TEvent extends EventName>(
    eventName: TEvent,
    listenerId: string,
    callback: EventListenerCallback<EventData<TEvent>>,
    once?: boolean,
  ): void;
  addListener<TEvent extends EventName>(
    eventName: TEvent,
    listenerId: string,
    callback: EventListenerCallback<EventData<TEvent>>,
    once?: boolean,
  ): void;

  /**
   * Adds a listener function to the **end** of the listeners array of
   * each event in the callbacks map, all under the same listener ID.
   *
   * Skips events on which a listener with the same ID is already
   * registered.
   *
   * @param listenerId - The ID of the listener which is being added.
   * @param callbacks - Callback functions keyed by event name.
   */
  addListeners(listenerId: string, callbacks: EventListenerCallbackMap): void;

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
  prependListener<TEvent extends EventName>(
    eventName: TEvent,
    listenerId: string,
    callback: EventListenerCallback<EventData<TEvent>>,
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
  addListenerBefore<TEvent extends EventName>(
    eventName: TEvent,
    beforeListenerId: string,
    listenerId: string,
    callback: EventListenerCallback<EventData<TEvent>>,
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
  addListenerAfter<TEvent extends EventName>(
    eventName: TEvent,
    afterListenerId: string,
    listenerId: string,
    callback: EventListenerCallback<EventData<TEvent>>,
    once?: boolean,
  ): void;

  /**
   * Checks whether a listener with ID `listenerId` exists in the listeners array
   * for the event named `eventName`.
   *
   * @param eventName - The name of the event on which to check.
   * @param listenerId - The ID of the listener to check for.
   */
  hasListener(eventName: EventName, listenerId: string): boolean;

  /**
   * Removes the listener with ID `listenerId` from the listeners array for the
   * event named `eventName`.
   *
   * @param eventName - The name of the event from which to remove the listener.
   * @param listenerId - The ID of the listener to remove.
   */
  removeListener(eventName: EventName, listenerId: string): void;

  /**
   * Calls each of the listeners registered for the event named `eventName`
   * in the order they were registered, passing the supplied arguments to each.
   *
   * Dispatching is fire and forget: the event is logged to the event
   * log synchronously, listeners are queued to run on a microtask,
   * and nothing is awaited.
   *
   * @param eventName - The name of the event.
   * @param data - The data associated with the event.
   */
  dispatch<TEvent extends EventName>(
    eventName: TEvent,
    data?: EventData<TEvent>,
  ): void;

  /**
   * Tracks the dispatched events of a type whose side effects are
   * in flight.
   *
   * @param eventName - The name of the event to track.
   * @returns The event's in-flight log entries, most recent last.
   */
  useLogs<TEvent extends EventName>(
    eventName: TEvent,
  ): EventLogEntry<EventData<TEvent>>[];

  /**
   * Test-only helpers.
   */
  tests: {
    /**
     * Waits until the listeners of every pending dispatch have
     * settled.
     *
     * @returns A promise which resolves once no dispatches are pending.
     */
    awaitAllListeners(): Promise<void>;

    /**
     * Waits for pending dispatches to settle, then clears all event
     * listeners and the event log. Clears synchronously when no
     * dispatches are pending.
     *
     * @returns A promise which resolves once the listeners and log have been cleared.
     */
    cleanup(): Promise<void>;
  };
}
