import { create } from 'zustand';
import { CollectionConfig } from '../types';

export interface CollectionsStore {
  /**
   * The user's collections as an [id]: Collection map.
   */
  collections: Record<string, CollectionConfig>;

  /**
   * Load collections into the store.
   */
  load(collection: CollectionConfig[]): void;

  /**
   * Add a collection to the store.
   */
  add(collection: CollectionConfig): void;

  /**
   * Updates a collection in the store by id.
   */
  update(id: string, data: Partial<CollectionConfig>): void;

  /**
   * Remove a collection from the store by id.
   */
  remove(id: string): void;

  /**
   * Clear all collections.
   */
  clear(): void;
}

export const CollectionsStore = create<CollectionsStore>()((set) => ({
  collections: {},

  load: (collections) =>
    set((state) => {
      return {
        collections: {
          ...state.collections,
          ...collections.reduce(
            (docs, collection) => ({ ...docs, [collection.name]: collection }),
            {},
          ),
        },
      };
    }),

  add: (collection) =>
    set((state) => {
      return {
        collections: { ...state.collections, [collection.name]: collection },
      };
    }),

  update: (id, data) =>
    set((state) => {
      const collections = { ...state.collections };
      const oldCollection = collections[id];
      delete collections[id];

      if (!oldCollection) {
        return {};
      }

      const newCollection = { ...oldCollection, ...data };

      collections[id] = newCollection;

      return { collections };
    }),

  remove: (id) =>
    set((state) => {
      const collections = { ...state.collections };

      delete collections[id];

      return { collections };
    }),

  clear: () =>
    set(() => {
      return { collections: {} };
    }),
}));
