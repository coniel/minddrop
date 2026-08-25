import { useEffect, useSyncExternalStore } from 'react';
import { ContentIconSetContents, ContentIconSetDefinition } from '../types';

const registry = new Map<string, ContentIconSetDefinition>();
const registryListeners = new Set<VoidFunction>();

// In-flight and resolved loads keyed by set ID, so each set's
// loader runs at most once
const loadPromises = new Map<string, Promise<ContentIconSetContents | null>>();

// Loaded set contents handed out as a snapshot, replaced (not
// mutated) whenever a set finishes loading
let loadedSets: Record<string, ContentIconSetContents> = {};

/**
 * Registers a content icon set without loading it. The set's
 * loader runs the first time the set is used.
 *
 * @param definition - The set to register.
 */
export function registerContentIconSet(
  definition: ContentIconSetDefinition,
): void {
  registry.set(definition.id, definition);
}

/**
 * Returns the registered content icon set definitions.
 */
export function getRegisteredContentIconSets(): ContentIconSetDefinition[] {
  return Array.from(registry.values());
}

/**
 * Loads a registered content icon set, running its loader on the
 * first call and reusing the result afterwards.
 *
 * @param id - ID of the set to load.
 * @returns The set's contents, or null if the set is not registered.
 */
export function loadContentIconSet(
  id: string,
): Promise<ContentIconSetContents | null> {
  const existingLoad = loadPromises.get(id);

  // Reuse the in-flight or resolved load
  if (existingLoad) {
    return existingLoad;
  }

  const definition = registry.get(id);

  // The set is not registered
  if (!definition) {
    return Promise.resolve(null);
  }

  // Run the loader and record the loaded contents
  const load = definition.load().then((contents) => {
    // Replace the snapshot to include the loaded set
    loadedSets = { ...loadedSets, [id]: contents };

    // Notify subscribers of the newly loaded set
    registryListeners.forEach((listener) => listener());

    return contents;
  });

  loadPromises.set(id, load);

  return load;
}

/**
 * Returns a loaded content icon set's contents, or null if the set
 * has not finished loading.
 *
 * @param id - ID of the set to get.
 * @returns The set's contents or null.
 */
export function getLoadedContentIconSet(
  id: string,
): ContentIconSetContents | null {
  return loadedSets[id] || null;
}

/**
 * Calls the callback whenever a content icon set finishes loading.
 *
 * @param callback - Called after a set loads.
 * @returns A callback which stops listening.
 */
export function subscribeToContentIconSets(
  callback: VoidFunction,
): VoidFunction {
  registryListeners.add(callback);

  return () => {
    registryListeners.delete(callback);
  };
}

/**
 * Returns a content icon set's contents, triggering the set's load
 * on first use. Returns null until the set has loaded.
 *
 * @param id - ID of the set to use.
 * @returns The set's contents or null while loading.
 */
export function useContentIconSet(id: string): ContentIconSetContents | null {
  // Track loaded sets so the component re-renders when the set loads
  const contents = useSyncExternalStore(subscribeToContentIconSets, () =>
    getLoadedContentIconSet(id),
  );

  useEffect(() => {
    // Trigger the load, a no-op once the set is loaded or loading
    loadContentIconSet(id);
  }, [id]);

  return contents;
}
