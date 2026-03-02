/**
 * Event dispatched when a persistence-aware store is mutated.
 * The platform layer listens for this event and handles
 * writing the data to the appropriate storage.
 */
export const StorePersistEvent = 'stores:persist';

/**
 * Payload dispatched with the `stores:persist` event.
 */
export type StorePersistEventData = {
  /**
   * Where to persist the data.
   */
  persistTo: 'app-config' | 'workspace-config';

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
export const StoreHydrateRequestEvent = 'stores:hydrate-request';

/**
 * Payload dispatched with the `stores:hydrate-request` event.
 */
export type StoreHydrateRequestEventData = {
  /**
   * Where the data is persisted.
   */
  persistTo: 'app-config' | 'workspace-config';

  /**
   * The namespace of the store requesting its data.
   */
  namespace: string;
};

/**
 * Event dispatched by the platform layer to provide a store
 * with its persisted data.
 */
export const StoreHydrateEvent = 'stores:hydrate';

/**
 * Payload dispatched with the `stores:hydrate` event.
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
 * Event dispatched after a store has been hydrated with
 * its persisted data.
 */
export const StoreHydratedEvent = 'stores:hydrated';

/**
 * Payload dispatched with the `stores:hydrated` event.
 */
export type StoreHydratedEventData = {
  /**
   * The namespace of the store that was hydrated.
   */
  namespace: string;
};
