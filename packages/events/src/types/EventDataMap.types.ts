/**
 * Registry of event names and their data, augmented by the packages
 * which define the events. Events which carry no data register `void`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EventDataMap {}

/**
 * An event name, which is a registered one or, until every event is
 * registered, any other string. The `string & {}` member keeps
 * autocomplete for registered names.
 */
export type EventName = keyof EventDataMap | (string & {});

/**
 * The data of a registered event, unknown for unregistered ones.
 */
export type EventData<TEvent extends EventName> =
  TEvent extends keyof EventDataMap ? EventDataMap[TEvent] : unknown;
