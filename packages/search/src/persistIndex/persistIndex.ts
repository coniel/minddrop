import { Databases } from '@minddrop/databases';
import { Fs } from '@minddrop/file-system';
import { searchIndexes } from '../searchIndexStore';
import { resolveIndexPath } from '../utils';

/**
 * Persists the MiniSearch index to disk along with the current
 * SQL version for validation on reload.
 *
 * @param workspaceId - The workspace whose index to persist.
 */
export async function persistIndex(workspaceId: string): Promise<void> {
  // Nothing to persist if the workspace has no index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Serialize the index along with the SQL version
  const version = Databases.sql.getVersion();
  const data = JSON.stringify({
    version,
    index: miniSearch.toJSON(),
  });

  const indexPath = resolveIndexPath(workspaceId);

  // Ensure the directory exists
  const dirPath = indexPath.replace(/\/[^/]+$/, '');
  await Fs.ensureDir(dirPath);

  // Write the index file
  await Fs.writeTextFile(indexPath, data);
}
