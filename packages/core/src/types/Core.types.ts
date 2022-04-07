import { EventListenerCallback } from './EventListener.types';
import { ResourceConfig } from './ResourceConfig.types';

export interface Core {
  /**
   * The application ID for which the core intance
   * was initialized.
   */
  appId: string;

  /**
   * The extension ID for which the core intance
   * was initialized.
   */
  extensionId: string;

  /**
   * Adds an event listener for the specified event.
   *
   * @param type The event type to listen to.
   * @param callback The callback fired when an even occurs.
   */
  addEventListener<T extends string = string, D = any>(
    type: T,
    callback: EventListenerCallback<T, D>,
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
   * Optionally, a type can be specified to remove
   * event listeners only for the specified event type.
   *
   * @param type The event listener type to remove.
   */
  removeAllEventListeners(type?: string): void;

  /**
   * Checks whether a specified event listener exists.
   * Only includes event listeners added by the source.
   *
   * @param type The event type.
   * @param callback The event listener callback.
   * @returns `true` if the specified event listener is present, otherwise `false`.
   */
  hasEventListener(
    type: string,
    callback: EventListenerCallback<string, any>,
  ): boolean;

  /**
   * Checks whether any event listeners exist.
   * Only includes event listeners added by the source.
   *
   * Optionally, a type can be specified to only check for
   * event listeners of the specified event type.
   *
   * @param type The event type.
   * @returns `true` if there are any event listeners of the specified type, otherwise `false`.
   */
  hasEventListeners(type?: string): boolean;

  /**
   * Returns the number of event listeners.
   * Only includes event listeners added by the source.
   *
   * Optionally, a type can be specified to count
   * event listeners only of the specified event type.
   *
   * @param type The type of event listener for which to get the count.
   * @returns The number of event listener of the specified type/
   */
  eventListenerCount(type?: string): number;

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
  registerResource<R>(connector: ResourceConfig<R>): void;

  /**
   * Unregisters a resource type. All resources of the specified
   * type will be permanently deleted. Fires a
   * `core:unregister-resource` event.
   *
   * @param resourceType The type of resource to unregister.
   */
  unregisterResource(resourceType: string): void;

  /**
   * Checks whether a specified resource is registrerd.
   *
   * @param type The resource type.
   * @returns `true` if the resource is registered, otherwise `false`.
   */
  isResourceRegistered(type: string): boolean;

  /**
   * Fetches all resource connectors.
   *
   * @returns All resource connectors.
   */
  getResourceConfigs(): ResourceConfig[];
}
