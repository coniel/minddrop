import { Events } from '@minddrop/events';
import { addDevToolsEvent } from '../addDevToolsEvent';
import { DevToolsListenerId } from '../constants';

// Name of the catch all listener, which is not itself an event
const CatchAllEventName = '*';

/**
 * Captures every dispatched event into the dev tools events.
 *
 * @returns A callback which stops capturing events.
 */
export function startEventCapture(): VoidFunction {
  Events.on(CatchAllEventName, DevToolsListenerId, (event) => {
    // The catch all listener reports itself alongside the events
    // it catches
    if (event.name === CatchAllEventName) {
      return;
    }

    addDevToolsEvent(event.name, event.data);
  });

  return () => Events.removeListener(CatchAllEventName, DevToolsListenerId);
}
