import { EventListener, Core, ResourceConfig } from '../types';

let eventListeners: EventListener[] = [];
let resourceConfigs: ResourceConfig[] = [];

export interface InitializeCoreOptions {
  /**
   * The application ID for which to initialize
   * the core instance.
   */
  appId: string;

  /**
   * The extension ID for which to initialize
   * the core instance.
   */
  extensionId: string;
}

/**
 * Creates an extension specific core API instance.
 *
 * @param extensionId The ID of the extension which will use the core API instance.
 * @returns A core API instance.
 */
export function initializeCore({
  appId,
  extensionId,
}: InitializeCoreOptions): Core {
  const core: Core = {
    appId,
    extensionId,

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

    registerResource: (resourceConfig) => {
      resourceConfigs.push(resourceConfig);
      core.dispatch('core:register-resource', resourceConfig);
    },

    unregisterResource: (type) => {
      const resourceConfig = resourceConfigs.find(
        (resourceConfig) => resourceConfig.type === type,
      );

      if (!resourceConfig) {
        return;
      }

      resourceConfigs = resourceConfigs.filter((c) => c.type !== type);
      core.dispatch('core:unregister-resource', resourceConfig);
    },

    isResourceRegistered: (type) =>
      !!resourceConfigs.find((resourceConfig) => resourceConfig.type === type),

    getResourceConfigs: () => resourceConfigs,
  };

  return core;
}
