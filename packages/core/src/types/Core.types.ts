import { EventListenerCallback } from './EventListener.types';
import { ResourceConnector } from './ResourceConnector.types';

export interface Core {
  /**
   * ResourceCOnnectors for registered resources.
   */
  resourceConnectors: ResourceConnector[];

  /**
   * Adds an event listener for the specified event.
   *
   * @param type The event type to listen to.
   * @param callback The callback fired when an even occurs.
   */
  addEventListener(
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Removes an event listener.
   *
   * @param type The event listener type.
   * @param callback The event listener callback.
   */
  removeEventListener(
    type: string,
    callback: EventListenerCallback<string, any>,
  ): void;

  /**
   * Removes all of the source's event listeners.
   */
  removeAllEventListeners(): void;

  /**
   * Dispatches an event.
   *
   * @param type The event type.
   * @param data The data associated with the event.
   */
  dispatch(type: string, data?: any): void;

  /**
   * Registers a new resource type. Fires a
   * `core:register-resource` event.
   *
   * @param connector The connector of the resource to register.
   */
  registerResource(connector: ResourceConnector): void;

  /**
   * Unregisters a resource type. All resources of the specified
   * type will be permanently deleted. Fires a
   * `core:unregister-resource` event.
   *
   * @param resourceType The type of resource to unregister.
   */
  unregisterResource(resourceType: string): void;
}
