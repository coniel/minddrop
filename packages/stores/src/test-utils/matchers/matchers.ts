import { expect } from 'vitest';
import {
  InspectableStore,
  assertStore,
  assertStoreType,
  getStoreItemIds,
  getStoreItems,
  missingItemMessage,
} from '../inspectStore';

expect.extend({
  toHaveItem(received: unknown, id: string, ...rest: unknown[]) {
    const store = assertStore(received, 'toHaveItem');
    const item = store.get(id);

    if (!item) {
      return {
        pass: false,
        message: () => missingItemMessage(store, id),
      };
    }

    // Called with an identifier alone, the matcher only asserts
    // that the store holds an item under it.
    if (!rest.length) {
      return {
        pass: true,
        message: () => `${store.name} has an item "${id}".`,
      };
    }

    const [expected] = rest;
    const pass = this.equals(item, expected);

    return {
      pass,
      actual: item,
      expected,
      message: () =>
        pass
          ? `${store.name} item "${id}" matches the expected value.`
          : `${store.name} item "${id}" does not match the expected value.`,
    };
  },

  toHaveItems(received: unknown, expected: unknown[]) {
    const store = assertStore(received, 'toHaveItems');
    const items = getStoreItems(store);
    const expectedItems = resolveExpectedItems(store, expected);
    const pass =
      items.length === expectedItems.length &&
      matchesIgnoringOrder(this.equals, items, expectedItems);

    return {
      pass,
      // Both sides are ordered by identifier so that the reported
      // diff lines items up rather than showing order differences
      // the matcher deliberately ignores.
      actual: sortByIdentifier(store, items),
      expected: sortByIdentifier(store, expectedItems),
      message: () =>
        pass
          ? `${store.name} holds the expected items.`
          : `${store.name} does not hold the expected items.`,
    };
  },

  toHaveItemCount(received: unknown, count: number) {
    const store = assertStore(received, 'toHaveItemCount');
    const actual = getStoreItems(store).length;
    const pass = actual === count;

    return {
      pass,
      actual,
      expected: count,
      message: () =>
        pass
          ? `${store.name} has ${count} items.`
          : `${store.name} has ${actual} items, expected ${count}.`,
    };
  },

  toHaveItemOrder(received: unknown, ids: string[]) {
    const store = assertStore(received, 'toHaveItemOrder');

    assertStoreType(store, 'array', 'toHaveItemOrder');

    const actual = getStoreItemIds(store);
    const pass = this.equals(actual, ids);

    return {
      pass,
      actual,
      expected: ids,
      message: () =>
        pass
          ? `${store.name} items are in the expected order.`
          : `${store.name} items are in a different order.`,
    };
  },

  toHaveStoredValue(received: unknown, key: string, expected: unknown) {
    const store = assertStore(received, 'toHaveStoredValue');

    assertStoreType(store, 'key-value', 'toHaveStoredValue');

    const actual = store.get(key);
    const pass = this.equals(actual, expected);

    return {
      pass,
      actual,
      expected,
      message: () =>
        pass
          ? `${store.name} value "${key}" matches the expected value.`
          : `${store.name} value "${key}" does not match the expected value.`,
    };
  },
});

/**
 * Resolves the expected items of a `toHaveItems` call, which are
 * given either as items or as the identifiers of items the store
 * is expected to hold.
 */
function resolveExpectedItems(
  store: InspectableStore,
  expected: unknown[],
): unknown[] {
  if (!expected.every((value) => typeof value === 'string')) {
    return expected;
  }

  return expected.map((id) => store.get(id));
}

/**
 * Checks that every expected item has a distinct match among the
 * given items, regardless of the order of either.
 */
function matchesIgnoringOrder(
  equals: (a: unknown, b: unknown) => boolean,
  items: unknown[],
  expected: unknown[],
): boolean {
  const unmatched = [...items];

  return expected.every((expectedItem) => {
    const index = unmatched.findIndex((item) => equals(item, expectedItem));

    if (index === -1) {
      return false;
    }

    unmatched.splice(index, 1);

    return true;
  });
}

/**
 * Orders items by their identifier, leaving them as they are when
 * the store has no identifier key or an item's identifier is not a
 * string (an asymmetric matcher, for instance).
 */
function sortByIdentifier(
  store: InspectableStore,
  items: unknown[],
): unknown[] {
  const { identifierKey } = store;

  if (!identifierKey) {
    return items;
  }

  const identifiers = items.map(
    (item) => (item as Record<string, unknown>)?.[identifierKey],
  );

  if (!identifiers.every((identifier) => typeof identifier === 'string')) {
    return items;
  }

  return [...items].sort((a, b) =>
    String((a as Record<string, unknown>)[identifierKey]).localeCompare(
      String((b as Record<string, unknown>)[identifierKey]),
    ),
  );
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> {
    /**
     * Asserts that the store holds an item under the given
     * identifier, optionally matching the expected item.
     */
    toHaveItem(id: string, expected?: unknown): T;

    /**
     * Asserts that the store holds exactly the given items,
     * ignoring order. Takes either the items or their identifiers.
     */
    toHaveItems(expected: unknown[]): T;

    /**
     * Asserts the number of items the store holds.
     */
    toHaveItemCount(count: number): T;

    /**
     * Asserts the order of an array store's items.
     */
    toHaveItemOrder(ids: string[]): T;

    /**
     * Asserts the value a key-value store holds under the given key.
     */
    toHaveStoredValue(key: string, expected: unknown): T;
  }
}
