import { EventData, EventName } from './EventDataMap.types';
import { EventListenerCallback } from './EventListenerCallback.types';

/**
 * Event listener callbacks keyed by the event they listen for.
 */
export type EventListenerCallbackMap = {
  [TEvent in EventName]?: EventListenerCallback<EventData<TEvent>>;
};
