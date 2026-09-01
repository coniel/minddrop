/**
 * Registry of event names and their data, augmented by the packages
 * which define the events. Events which carry no data register `void`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EventDataMap {}

/**
 * A registered event name. Names outside the registry are not
 * dispatchable or listenable.
 */
export type EventName = keyof EventDataMap;

/**
 * The data of a registered event.
 */
export type EventData<TEvent extends EventName> = EventDataMap[TEvent];
