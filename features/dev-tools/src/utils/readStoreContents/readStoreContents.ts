import { RegisteredStoreType } from '@minddrop/stores';
import { StoreContents } from '../../types';

/**
 * Reads a store's contents out of its state, which holds them
 * differently depending on the store's type.
 *
 * @param type - The type of the store.
 * @param state - The store's state.
 * @returns The store's items or values.
 */
export function readStoreContents(
  type: RegisteredStoreType,
  state: unknown,
): StoreContents {
  const { items, values } = (state ?? {}) as {
    items?: unknown;
    values?: unknown;
  };

  // Key-value stores hold a record of values
  if (type === 'key-value') {
    return { kind: 'values', values: toRecord(values) };
  }

  // Array stores hold their items in order
  if (type === 'array') {
    return { kind: 'items', items: toRecords(items) };
  }

  // Object stores hold their items keyed by identifier
  return { kind: 'items', items: toRecords(Object.values(toRecord(items))) };
}

/**
 * Returns the value as a list of records, or an empty list when
 * it is not a list.
 */
function toRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(toRecord);
}

/**
 * Returns the value as a record, or an empty record when it is
 * not one.
 */
function toRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}
