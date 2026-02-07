import { QueriesStore } from '../QueriesStore';
import { readQueryConfig } from '../readQueryConfig';

/**
 * Loads queries from the specified paths into the store.
 *
 * @param paths - The paths to the query configs to load.
 */
export async function loadQueries(paths: string[]): Promise<void> {
  // Read the query configs
  const queries = await Promise.all(paths.map((path) => readQueryConfig(path)));

  // Load the queries into the store
  QueriesStore.load(queries);
}
