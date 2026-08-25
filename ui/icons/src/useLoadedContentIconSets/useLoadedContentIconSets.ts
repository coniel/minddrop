import { useEffect, useState } from 'react';
import {
  getRegisteredContentIconSets,
  loadContentIconSet,
} from '../contentIconSetRegistry';
import { LoadedContentIconSet, MinifiedContentIcon } from '../types';
import {
  buildIconLabelIndex,
  groupByCategory,
  searchContentIcons,
  unminifyContentIcon,
} from './utils';

// Loaded and prepared sets cached by set ID so repeated use has
// nothing to recompute
const loadedSetsCache = new Map<string, LoadedContentIconSet>();

/**
 * Loads every registered content icon set's contents and prepares
 * them for listing and searching. Returns null until loaded.
 *
 * @returns The loaded sets or null while loading.
 */
export function useLoadedContentIconSets(): LoadedContentIconSet[] | null {
  const [sets, setSets] = useState<LoadedContentIconSet[] | null>(null);

  useEffect(() => {
    let active = true;

    // Load every registered set's contents
    Promise.all(
      getRegisteredContentIconSets().map((definition) =>
        loadIconSet(definition.id, definition.name),
      ),
    ).then((loadedSets) => {
      // Ignore the result if the consumer unmounted while loading
      if (active) {
        setSets(loadedSets.filter((set) => set !== null));
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return sets;
}

/**
 * Loads a set's contents and prepares its icons for listing and
 * searching, reusing previously prepared sets.
 */
async function loadIconSet(
  id: string,
  name: string,
): Promise<LoadedContentIconSet | null> {
  // Reuse previously prepared sets
  const cached = loadedSetsCache.get(id);

  if (cached) {
    return cached;
  }

  const contents = await loadContentIconSet(id);

  // Skip sets which failed to load
  if (!contents) {
    return null;
  }

  // Unminify the set's icons
  const icons = contents.metadata.icons.map((icon) =>
    unminifyContentIcon(
      icon as MinifiedContentIcon,
      id,
      contents.metadata.categories,
      contents.metadata.labels,
    ),
  );

  // Build the search index and category grouping once per set
  const { labels, labelToIcon } = buildIconLabelIndex(icons);
  const loadedSet: LoadedContentIconSet = {
    id,
    name,
    icons,
    iconsByCategory: groupByCategory(icons),
    search: (query: string) =>
      searchContentIcons(icons, labels, labelToIcon, query),
  };

  loadedSetsCache.set(id, loadedSet);

  return loadedSet;
}
