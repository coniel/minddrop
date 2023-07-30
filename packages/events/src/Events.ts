import { addEventListener } from './addEventListener';
import { addEventListenerAfter } from './addEventListenerAfter';
import { addEventListenerBefore } from './addEventListenerBefore';
import { dispatchEvent } from './dispatchEvent';
import { hasEventListener } from './hasEventListener';
import { prependEventListener } from './prependEventListener';
import { removeEventListener } from './removeEventListener';
import { EventListenerMap, EventsApi } from './types';

const eventListeners: EventListenerMap = {};

export const Events: EventsApi = {
  addListener: (...args) => addEventListener(eventListeners, ...args),
  prependListener: (...args) => prependEventListener(eventListeners, ...args),
  dispatch: (...args) => dispatchEvent(eventListeners, ...args),
  addListenerBefore: (...args) =>
    addEventListenerBefore(eventListeners, ...args),
  addListenerAfter: (...args) => addEventListenerAfter(eventListeners, ...args),
  removeListener: (...args) => removeEventListener(eventListeners, ...args),
  hasListener: (...args) => hasEventListener(eventListeners, ...args),
};
