import { Fs } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsConfigDir, CollectionsConfigFileName } from '../constants';

/**
 * Persists collections config by writing store values
 * to the collections config file.
 */
export async function writeCollectionsConfig(): Promise<void> {
  const fileContents = {
    paths: Object.values(CollectionsStore.getState().collections).map(
      (collection) => collection.path,
    ),
  };

  // Write config file
  await Fs.writeTextFile(
    CollectionsConfigFileName,
    JSON.stringify(fileContents),
    {
      baseDir: CollectionsConfigDir,
    },
  );
}
