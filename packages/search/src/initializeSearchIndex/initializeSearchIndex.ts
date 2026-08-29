import MiniSearch from 'minisearch';
import { Databases } from '@minddrop/databases';
import { Fs } from '@minddrop/file-system';
import { MINISEARCH_OPTIONS } from '../minisearchOptions';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchIndexes } from '../searchIndexStore';
import type { SearchDocument } from '../types';
import { resolveIndexPath } from '../utils';

/**
 * Initializes the MiniSearch index for a workspace. Loads from
 * disk if a persisted index exists and its version matches the
 * SQL database version. Otherwise, rebuilds from SQL data.
 *
 * @param workspaceId - The workspace to initialize the index for.
 */
export async function initializeSearchIndex(
  workspaceId: string,
): Promise<void> {
  const currentVersion = Databases.sql.getVersion();
  const indexPath = resolveIndexPath(workspaceId);

  // Try loading persisted index
  try {
    const raw = await Fs.readTextFile(indexPath);
    const persisted = JSON.parse(raw) as {
      version: number;
      index: object;
    };

    // Use the persisted index only if it matches the SQL version
    if (persisted.version === currentVersion) {
      const miniSearch = MiniSearch.loadJSON<SearchDocument>(
        JSON.stringify(persisted.index),
        MINISEARCH_OPTIONS,
      );

      searchIndexes.set(workspaceId, miniSearch);

      return;
    }
  } catch {
    // No persisted index or parse error, rebuild
  }

  // Build from SQL data
  await rebuildSearchIndex(workspaceId);
}
