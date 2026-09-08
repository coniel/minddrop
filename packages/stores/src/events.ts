import { PersistTarget } from './types';

/**
 * Event dispatched when a persistence-aware store is mutated.
 * The platform layer listens for this event and handles
 * writing the data to the appropriate storage.
 */
export const StorePersistEvent = 'stores:store:persist';

/**
 * Payload dispatched with the `stores:store:persist` event.
 */
export type StorePersistEventData = {
  /**
   * Where to persist the data.
   */
  persistTo: PersistTarget;

  /**
   * The namespace of the store.
   */
  namespace: string;

  /**
   * The current store data to persist.
   */
  data: Record<string, unknown> | unknown[];
};

/**
 * Event dispatched when a store requests its persisted
 * data from the platform layer.
 */
export const StoreHydrateRequestEvent = 'stores:store:hydrate-request';

/**
 * Payload dispatched with the `stores:store:hydrate-request` event.
 */
export type StoreHydrateRequestEventData = {
  /**
   * Where the data is persisted.
   */
  persistTo: PersistTarget;

  /**
   * The namespace of the store requesting its data.
   */
  namespace: string;
};

/**
 * Event dispatched by the platform layer to provide a store
 * with its persisted data.
 */
export const StoreHydrateEvent = 'stores:store:hydrate';

/**
 * Payload dispatched with the `stores:store:hydrate` event.
 */
export type StoreHydrateEventData = {
  /**
   * The namespace of the store being hydrated.
   */
  namespace: string;

  /**
   * The persisted data to load into the store.
   */
  data: Record<string, unknown> | unknown[];
};

/**
 * Event dispatched by the platform layer once a store's data has
 * been written to storage.
 */
export const StorePersistedEvent = 'stores:store:persisted';

/**
 * Payload dispatched with the `stores:store:persisted` event.
 */
export type StorePersistedEventData = {
  /**
   * The namespace of the store whose data was written.
   */
  namespace: string;
};

/**
 * Event dispatched after a store has been hydrated with
 * its persisted data.
 */
export const StoreHydratedEvent = 'stores:store:hydrated';

/**
 * Payload dispatched with the `stores:store:hydrated` event.
 */
export type StoreHydratedEventData = {
  /**
   * The namespace of the store that was hydrated.
   */
  namespace: string;
};

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'stores:store:persist': StorePersistEventData;
    'stores:store:persisted': StorePersistedEventData;
    'stores:store:hydrate-request': StoreHydrateRequestEventData;
    'stores:store:hydrate': StoreHydrateEventData;
    'stores:store:hydrated': StoreHydratedEventData;
  }
}
