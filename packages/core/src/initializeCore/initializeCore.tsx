import { EventListener, Core } from '../types';

let eventListeners: EventListener[] = [];

export function initializeCore(): Core {
  return {
    addEventListener: (source, type, callback) =>
      eventListeners.push({ source, type, callback }),

    removeEventListener: (source, type, callback) => {
      eventListeners = eventListeners.filter(
        (listener) =>
          !(
            listener.source === source &&
            listener.type === type &&
            listener.callback === callback
          ),
      );
    },

    dispatch: (source, type, data) =>
      eventListeners
        .filter((listener) => listener.type === type)
        .forEach((listener) => listener.callback({ source, type, data })),
  };
}
