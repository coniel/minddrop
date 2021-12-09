import { EventListener, Core } from '../types';

let eventListeners: EventListener[] = [];

/**
 * Creates an extension specific core API instance.
 *
 * @param extensionId The ID of the extension which will use the core API instance.
 * @returns A core API instance.
 */
export function initializeCore(extensionId: string): Core {
  const core: Core = {
    resourceConnectors: [],

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

    registerResource: (connector) => {
      core.resourceConnectors.push(connector);
      core.dispatch('core:register-resource', connector);
    },

    unregisterResource: (type) => {
      const connector = core.resourceConnectors.find(
        (connector) => connector.type === type,
      );

      if (!connector) {
        return;
      }

      core.resourceConnectors = core.resourceConnectors.filter(
        (c) => c.type !== type,
      );
      core.dispatch('core:unregister-resource', connector);
    },
  };

  return core;
}
