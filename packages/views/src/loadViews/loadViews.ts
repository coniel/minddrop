import { ViewsStore } from '../ViewsStore';
import { readViewConfig } from '../readViewConfig';

/**
 * Loads view configs from the specified paths into the store.
 *
 * @param paths - The paths to the view configs to load.
 */
export async function loadViews(paths: string[]): Promise<void> {
  // Read the view configs
  const views = await Promise.all(paths.map((path) => readViewConfig(path)));

  // Load the views into the store
  ViewsStore.load(views);
}
