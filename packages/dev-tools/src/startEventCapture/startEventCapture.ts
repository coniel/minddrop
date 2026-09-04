import { Events } from '@minddrop/events';
import { addDevToolsEvent } from '../addDevToolsEvent';
import { DevToolsNamespace } from '../constants';
import { isDevToolsEvent } from '../utils';

// Name of the catch all listener, which is not itself an event
const CatchAllEventName = '*';

/**
 * Captures every dispatched event into the dev tools events,
 * leaving out the events the dev tools dispatch themselves.
 *
 * @returns A callback which stops capturing events.
 */
export function startEventCapture(): VoidFunction {
  Events.on(CatchAllEventName, DevToolsNamespace, (data, eventName) => {
    // The catch all listener reports itself alongside the events
    // it catches
    if (eventName === CatchAllEventName) {
      return;
    }

    // Using the dev tools persists their own state, which would
    // otherwise fill the events with the user's every click
    if (isDevToolsEvent(data)) {
      return;
    }

    addDevToolsEvent(eventName, data);
  });

  return () => Events.removeListener(CatchAllEventName, DevToolsNamespace);
}
