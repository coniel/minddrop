import { EventName } from '@minddrop/events';

/**
 * Configuration options for a registry.
 */
export interface RegistryOptions {
  /**
   * What the registry holds, used in the not registered error
   * message (e.g. "data view type").
   */
  label: string;

  /**
   * The events dispatched when an item is registered or
   * unregistered. Omitted events are not dispatched.
   */
  events?: {
    /**
     * The event dispatched with the item after it is registered.
     */
    registered?: EventName;

    /**
     * The event dispatched with the item after it is unregistered.
     */
    unregistered?: EventName;
  };
}
