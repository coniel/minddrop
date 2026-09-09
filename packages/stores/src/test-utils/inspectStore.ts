import { RegisteredStoreType } from '../storeRegistry';

/**
 * The parts of a store the test helpers read, in the shape they
 * share across the three store types.
 */
export interface InspectableStore {
  name: string;
  type: RegisteredStoreType;
  identifierKey?: string;
  get(key: string): unknown;
  getAll(): unknown;
}

/**
 * Checks whether a value is one of the stores created by
 * createObjectStore, createArrayStore or createKeyValueStore.
 *
 * @param value - The value to check.
 * @returns Whether the value is a store.
 */
export function isStore(value: unknown): value is InspectableStore {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<InspectableStore>;

  return (
    typeof candidate.name === 'string' &&
    (candidate.type === 'object' ||
      candidate.type === 'array' ||
      candidate.type === 'key-value') &&
    typeof candidate.get === 'function' &&
    typeof candidate.getAll === 'function'
  );
}

/**
 * Returns a store's items as an array.
 *
 * @param store - The store to read.
 * @returns The store's items.
 */
export function getStoreItems(store: InspectableStore): unknown[] {
  const items = store.getAll();

  if (store.type === 'array') {
    return items as unknown[];
  }

  return Object.values(items as Record<string, unknown>);
}

/**
 * Returns the identifiers of a store's items, in the order the
 * store holds them.
 *
 * @param store - The store to read.
 * @returns The item identifiers.
 */
export function getStoreItemIds(store: InspectableStore): string[] {
  if (store.type === 'array') {
    const { identifierKey } = store;

    return getStoreItems(store).map((item) =>
      String((item as Record<string, unknown>)[identifierKey as string]),
    );
  }

  return Object.keys(store.getAll() as Record<string, unknown>);
}

/**
 * Returns the message describing a store which does not hold a
 * requested item, listing the items it does hold.
 *
 * @param store - The store which was read.
 * @param id - The identifier which was not found.
 * @returns The message.
 */
export function missingItemMessage(
  store: InspectableStore,
  id: string,
): string {
  const ids = getStoreItemIds(store);
  const contents = ids.length ? `It holds: ${ids.join(', ')}.` : 'It is empty.';

  return `${store.name} has no item "${id}". ${contents}`;
}

/**
 * Throws when a store is not of the required type, naming the
 * matcher which cannot be used on it.
 *
 * @param store - The store to check.
 * @param type - The store type the matcher requires.
 * @param matcher - The name of the matcher being used.
 */
export function assertStoreType(
  store: InspectableStore,
  type: RegisteredStoreType,
  matcher: string,
): void {
  if (store.type === type) {
    return;
  }

  throw new Error(
    `${matcher} can only be used on ${type} stores. ${store.name} is a ${store.type} store.`,
  );
}

/**
 * Throws when a value handed to a matcher is not a store.
 *
 * @param value - The value to check.
 * @param matcher - The name of the matcher being used.
 * @returns The value as a store.
 */
export function assertStore(value: unknown, matcher: string): InspectableStore {
  if (!isStore(value)) {
    throw new Error(
      `${matcher} expects a store, received ${describeValue(value)}.`,
    );
  }

  return value;
}

/**
 * Returns a short description of a value for use in an error message.
 */
function describeValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return 'an array';
  }

  return `a ${typeof value}`;
}
