import { RegisteredStore } from '@minddrop/stores';

/**
 * A group of registered stores sharing a namespace, the part of
 * their name before the colon.
 */
export interface RegisteredStoreGroup {
  /**
   * The namespace the stores share.
   */
  namespace: string;

  /**
   * The stores registered under the namespace.
   */
  stores: RegisteredStore[];
}

/**
 * The contents of a registered store, as either a list of items
 * or a record of values depending on the store's type.
 */
export type StoreContents =
  | {
      /**
       * Array and object stores hold a list of items.
       */
      kind: 'items';

      /**
       * The store's items.
       */
      items: Record<string, unknown>[];
    }
  | {
      /**
       * Key-value stores hold a record of values.
       */
      kind: 'values';

      /**
       * The store's values.
       */
      values: Record<string, unknown>;
    };
