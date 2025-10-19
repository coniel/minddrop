import { createArrayStore } from '@minddrop/utils';
import { Item } from './types';

export const ItemsStore = createArrayStore<Item>('path');

/**
 * Adds a item to the store.
 *
 * @param entry - The item to add.
 */
export const addItem = (entry: Item): void => ItemsStore.add(entry);

/**
 * Removes a item from the store.
 *
 * @param path - The item's path.
 */
export const removeItem = (path: string): void => ItemsStore.remove(path);

/**
 * Updates a item in the store.
 *
 * @param path - The item's path.
 * @param properties - The updated properties to set on the item.
 */
export const updateItem = (path: string, properties: Partial<Item>): void =>
  ItemsStore.update(path, properties);

/**
 * Retrieves a item by path or null if it doesn't exist.
 *
 * @param path - The item's path.
 * @returns The item or null if it doesn't exist.
 */
export const getItem = (path: string): Item | null => ItemsStore.get(path);

/**
 * Retrieves all items of a given type.
 *
 * @param type - The item type.
 * @returns An array of all items of the given type.
 */
export const getItems = (type: string): Item[] =>
  ItemsStore.getAll().filter((entry) => entry.type === type);

/**
 * Retrieves all items.
 *
 * @returns An array of all items.
 */
export const getAllItems = (): Item[] => ItemsStore.getAll();

/**
 * Loads items into the store.
 *
 * @param items - The items to load.
 */
export const loadItem = (items: Item[]): void => ItemsStore.load(items);

/**
 * Retrieves a item by path or null if it doesn't exist.
 *
 * @param path - The item's path.
 * @returns The item or null if it doesn't exist.
 */
export const useItem = (path: string): Item | null => {
  return ItemsStore.useAllItems().find((entry) => entry.path === path) || null;
};

/**
 * Retrieves all items of a given type.
 *
 * @param type - The item type.
 * @returns And array of all items of the given type.
 */
export const useItemType = (type: string): Item[] => {
  return ItemsStore.useAllItems().filter((entry) => entry.type === type);
};
