import { EventData, EventName, Events } from '@minddrop/events';
import { ObjectItemStore, createObjectStore } from '../createObjectStore';
import { NotRegisteredError } from '../errors';
import { RegistryOptions } from '../types';

export interface Registry<TItem extends object> {
  /**
   * The object store holding the registered items, exposed for
   * tests and the dev tools store inspector.
   */
  store: ObjectItemStore<TItem>;

  /**
   * Registers an item, replacing any item registered under the
   * same identifier.
   *
   * @param item - The item to register.
   */
  register(item: TItem): void;

  /**
   * Unregisters the item registered under the given identifier.
   * Does nothing when no item is registered under it.
   *
   * @param id - The identifier of the item to unregister.
   */
  unregister(id: string): void;

  /**
   * Retrieves the item registered under the given identifier.
   *
   * @param id - The identifier of the item to retrieve.
   */
  get(id: string): TItem;

  /**
   * Retrieves the item registered under the given identifier, or
   * null when nothing is registered under it.
   *
   * @param id - The identifier of the item to retrieve.
   * @param throwOnNotFound - Whether to throw when nothing is registered under the identifier.
   */
  get(id: string, throwOnNotFound: false): TItem | null;

  /**
   * Returns all registered items in registration order.
   */
  getAll(): TItem[];

  /**
   * A hook which returns the item registered under the given
   * identifier, or null when nothing is registered under it.
   *
   * @param id - The identifier of the item to retrieve.
   */
  use(id: string): TItem | null;

  /**
   * A hook which returns all registered items in registration order.
   */
  useAll(): TItem[];

  /**
   * Unregisters every item.
   */
  clear(): void;
}

/**
 * Creates a registry, providing a register, unregister and lookup
 * interface for items registered under an identifier.
 *
 * The items are held in an object store, so the registry appears in
 * the store registry and the dev tools store inspector.
 *
 * @param name - The namespaced name for the store registry (e.g. "DataViews:DataViewTypes").
 * @param identifierKey - The key to use as the identifier for the items.
 * @param options - The registry's label and registration events.
 * @returns The registry.
 */
export function createRegistry<TItem extends object>(
  name: string,
  identifierKey: keyof TItem,
  options: RegistryOptions,
): Registry<TItem> {
  const store = createObjectStore<TItem>(name, identifierKey);

  // Create the `get` function which throws when nothing is
  // registered under the identifier unless told not to.
  function get(id: string): TItem;
  function get(id: string, throwOnNotFound: false): TItem | null;
  function get(id: string, throwOnNotFound = true): TItem | null {
    const item = store.get(id);

    // Ensure an item is registered under the identifier
    if (!item && throwOnNotFound) {
      throw new NotRegisteredError(options.label, id);
    }

    return item;
  }

  function register(item: TItem): void {
    // Add the item to the store
    store.set(item);

    // Dispatch the registered event
    dispatchRegistryEvent(options.events?.registered, item);
  }

  function unregister(id: string): void {
    const item = store.get(id);

    // Do nothing when nothing is registered under the identifier
    if (!item) {
      return;
    }

    // Remove the item from the store
    store.remove(id);

    // Dispatch the unregistered event
    dispatchRegistryEvent(options.events?.unregistered, item);
  }

  return {
    store,
    register,
    unregister,
    get,
    getAll: () => store.getAllArray(),
    use: (id) => store.useItem(id),
    useAll: () => store.useAllItemsArray(),
    clear: () => store.clear(),
  };
}

/**
 * Dispatches a registration event with the item, doing nothing when
 * the registry was created without the event.
 *
 * @param eventName - The name of the event to dispatch.
 * @param item - The item to dispatch as the event data.
 */
function dispatchRegistryEvent(
  eventName: EventName | undefined,
  item: object,
): void {
  // Skip registries which do not dispatch the event
  if (!eventName) {
    return;
  }

  // The registry holds the event name as an `EventName` rather than
  // a literal, so the item is widened to the data of any event.
  Events.dispatch(eventName, item as EventData<EventName>);
}
