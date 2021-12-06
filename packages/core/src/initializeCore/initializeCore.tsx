import { EventListener, Core } from '../types';

let eventListeners: EventListener[] = [];

/**
 * Creates an extension specific core API instance.
 *
 * @param extensionId The ID of the extension which will use the core API instance.
 * @returns A core API instance.
 */
export function initializeCore(extensionId: string): Core {
  return {
    addEventListener: (type, callback) =>
      eventListeners.push({ source: extensionId, type, callback }),

    removeEventListener: (type, callback) => {
      eventListeners = eventListeners.filter(
        (listener) =>
          !(
            listener.source === extensionId &&
            listener.type === type &&
            listener.callback === callback
          ),
      );
    },

    removeAllEventListeners: () => {
      eventListeners = eventListeners.filter(
        (listener) => listener.source !== extensionId,
      );
    },

    dispatch: (type, data) =>
      eventListeners
        .filter((listener) => listener.type === type)
        .forEach((listener) =>
          listener.callback({ source: extensionId, type, data }),
        ),
  };
}
