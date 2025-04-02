import { FileNotFoundError, Fs, InvalidPathError } from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import {
  CollectionsConfigDir,
  CollectionsConfigFileName,
  InitialCollectionsConfig,
} from '../constants';
import { getCollectionsConfig } from '../getCollectionsConfig';

/**
 * Initializes the collections config file unless it already exists
 * and is valid.
 *
 * @throws {InvalidPathError} If the path to the parent directory is invalid.
 */
export async function initializeCollectionsConfig(): Promise<void> {
  // Ensure that the confgis directory exists
  if (!(await Fs.exists(CollectionsConfigDir))) {
    throw new InvalidPathError(CollectionsConfigDir);
  }

  try {
    // Fetch the user's collections config
    await getCollectionsConfig();
  } catch (error) {
    // If the collections config file does not exist or could not be
    // parsed, re-initialize the collections config file
    if (error instanceof FileNotFoundError || error instanceof JsonParseError) {
      await Fs.writeTextFile(
        CollectionsConfigFileName,
        JSON.stringify(InitialCollectionsConfig),
        {
          baseDir: CollectionsConfigDir,
        },
      );
    }
  }
}
