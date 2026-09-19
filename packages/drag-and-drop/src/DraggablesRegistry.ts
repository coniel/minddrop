export interface DraggableEntry {
  /**
   * The key identifying the drag source's hook instance.
   */
  key: string;

  /**
   * The drag source's element.
   */
  element: HTMLElement;

  /**
   * Returns the ID of the item the source drags.
   */
  getId: () => string;

  /**
   * Returns the element standing in for the source in the drag's
   * preview, or null to show the source itself.
   */
  resolvePreview: () => Element | null;
}

// The registered drag sources, keyed by hook instance
const entries = new Map<string, DraggableEntry>();

/**
 * The registry of drag sources.
 */
export const DraggablesRegistry = {
  /**
   * Registers a drag source, replacing any registered under the
   * same key.
   *
   * @param entry - The drag source to register.
   */
  register(entry: DraggableEntry): void {
    entries.set(entry.key, entry);
  },

  /**
   * Unregisters the drag source registered under the key. Does
   * nothing when none is.
   *
   * @param key - The key of the drag source to unregister.
   */
  unregister(key: string): void {
    entries.delete(key);
  },

  /**
   * Returns every registered drag source.
   *
   * @returns The drag sources in registration order.
   */
  getAll(): DraggableEntry[] {
    return Array.from(entries.values());
  },

  /**
   * Unregisters every drag source.
   */
  clear(): void {
    entries.clear();
  },
};
