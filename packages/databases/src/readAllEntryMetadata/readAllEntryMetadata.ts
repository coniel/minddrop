import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { listEntryMetadataKeys } from '../listEntryMetadataKeys';
import { DatabaseEntryMetadata } from '../types';
import { resolveDatabaseMetadataDirPath } from '../utils';

/**
 * Reads every entry metadata sidecar in a database.
 *
 * @param databasePath - The absolute path to the database directory.
 * @returns A map of sidecar name to that entry's metadata.
 */
export async function readAllEntryMetadata(
  databasePath: string,
): Promise<Record<string, DatabaseEntryMetadata>> {
  const keys = await listEntryMetadataKeys(databasePath);
  const dirPath = resolveDatabaseMetadataDirPath(databasePath);
  const paths = keys.map((key) => `${dirPath}/${key}.json`);

  const contents = await Fs.readTextFiles(paths);
  const metadata: Record<string, DatabaseEntryMetadata> = {};

  keys.forEach((key, index) => {
    const text = contents.get(paths[index]);

    if (text === undefined) {
      return;
    }

    try {
      metadata[key] = restoreDates(JSON.parse(text));
    } catch {
      // Skip sidecars which are not valid JSON
    }
  });

  return metadata;
}
