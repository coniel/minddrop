import { RefObject } from 'react';
import { DroppableOptions, DroppableOverState } from './types';

export interface DroppableEntry {
  /**
   * The key identifying the drop target's hook instance.
   */
  key: string;

  /**
   * The drop target's element.
   */
  element: HTMLElement;

  /**
   * The drop target's current options.
   */
  options: RefObject<DroppableOptions>;

  /**
   * Tells the drop target whether a drag is over it and where the
   * drop would land.
   */
  notify: (state: DroppableOverState) => void;
}

// The registered drop targets, keyed by hook instance
const entries = new Map<string, DroppableEntry>();

/**
 * The registry of drop targets.
 */
export const DroppablesRegistry = {
  /**
   * Registers a drop target, replacing any registered under the
   * same key.
   *
   * @param entry - The drop target to register.
   */
  register(entry: DroppableEntry): void {
    entries.set(entry.key, entry);
  },

  /**
   * Unregisters the drop target registered under the key. Does
   * nothing when none is.
   *
   * @param key - The key of the drop target to unregister.
   */
  unregister(key: string): void {
    entries.delete(key);
  },

  /**
   * Retrieves the drop target registered under the key, or null when
   * none is.
   *
   * @param key - The key of the drop target to retrieve.
   * @returns The drop target, or null when none is registered under the key.
   */
  get(key: string): DroppableEntry | null {
    return entries.get(key) ?? null;
  },

  /**
   * Returns every registered drop target.
   *
   * @returns The drop targets in registration order.
   */
  getAll(): DroppableEntry[] {
    return Array.from(entries.values());
  },

  /**
   * Unregisters every drop target.
   */
  clear(): void {
    entries.clear();
  },
};
