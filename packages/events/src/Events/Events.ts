import { clearEventLog } from '../EventLogsStore';
import {
  awaitPendingDispatches,
  hasPendingDispatches,
} from '../PendingDispatchesStore';
import { addEventListener } from '../addEventListener';
import { addEventListenerAfter } from '../addEventListenerAfter';
import { addEventListenerBefore } from '../addEventListenerBefore';
import { addEventListeners } from '../addEventListeners';
import { dispatchEvent } from '../dispatchEvent';
import { hasEventListener } from '../hasEventListener';
import { prependEventListener } from '../prependEventListener';
import { removeEventListener } from '../removeEventListener';
import { EventListenerMap, EventsApi } from '../types';
import { useEventLogEntries } from '../useEventLogEntries';

let eventListeners: EventListenerMap = {};

export const Events: EventsApi = {
  listeners: eventListeners,
  addListener: (...args) => addEventListener(eventListeners, ...args),
  on: (...args) => addEventListener(eventListeners, ...args),
  addListeners: (...args) => addEventListeners(eventListeners, ...args),
  prependListener: (...args) => prependEventListener(eventListeners, ...args),
  dispatch: (...args) => dispatchEvent(eventListeners, ...args),
  addListenerBefore: (...args) =>
    addEventListenerBefore(eventListeners, ...args),
  addListenerAfter: (...args) => addEventListenerAfter(eventListeners, ...args),
  removeListener: (...args) => removeEventListener(eventListeners, ...args),
  hasListener: (...args) => hasEventListener(eventListeners, ...args),
  useLogs: useEventLogEntries,
  tests: {
    awaitAllListeners: awaitPendingDispatches,
    cleanup: () => {
      // Clear the listeners and the event log
      const clear = () => {
        eventListeners = {};
        clearEventLog();
      };

      // Clear synchronously when nothing is in flight, so callers
      // which do not await still start their next test clean
      if (!hasPendingDispatches()) {
        clear();

        return Promise.resolve();
      }

      // Let the in-flight listeners settle before clearing
      return awaitPendingDispatches().then(clear);
    },
  },
};
