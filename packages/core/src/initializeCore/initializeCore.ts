import { EventListener, Core, ResourceConnector } from '../types';

let eventListeners: EventListener[] = [];
let resourceConnectors: ResourceConnector[] = [];

/**
 * Creates an extension specific core API instance.
 *
 * @param extensionId The ID of the extension which will use the core API instance.
 * @returns A core API instance.
 */
export function initializeCore(extensionId: string): Core {
  const core: Core = {
    initializedFor: extensionId,

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

    removeAllEventListeners: (type) => {
      eventListeners = eventListeners.filter((listener) => {
        let keep = listener.source !== extensionId;

        if (type && !keep) {
          keep = listener.type !== type;
        }

        return keep;
      });
    },

    hasEventListener: (type, callback) =>
      !!eventListeners.find(
        (listener) =>
          listener.source === extensionId &&
          listener.type === type &&
          listener.callback === callback,
      ),

    hasEventListeners: (type) =>
      !!eventListeners.find((listener) => {
        let has = listener.source === extensionId;

        if (type && has) {
          has = listener.type === type;
        }

        return has;
      }),

    eventListenerCount: (type) =>
      eventListeners.filter((listener) => {
        let count = listener.source === extensionId;

        if (count && type) {
          count = listener.type === type;
        }

        return count;
      }).length,

    dispatch: (type, data) =>
      eventListeners
        .filter((listener) => listener.type === type || listener.type === '*')
        .forEach((listener) => {
          // We use setTimeout to run the function in a non-blocking way
          setTimeout(
            () => listener.callback({ source: extensionId, type, data }),
            0,
          );
        }),

    registerResource: (connector) => {
      resourceConnectors.push(connector);
      core.dispatch('core:register-resource', connector);
    },

    unregisterResource: (type) => {
      const connector = resourceConnectors.find(
        (connector) => connector.type === type,
      );

      if (!connector) {
        return;
      }

      resourceConnectors = resourceConnectors.filter((c) => c.type !== type);
      core.dispatch('core:unregister-resource', connector);
    },

    isResourceRegistered: (type) =>
      !!resourceConnectors.find((connector) => connector.type === type),

    getResourceConnectors: () => resourceConnectors,
  };

  return core;
}
