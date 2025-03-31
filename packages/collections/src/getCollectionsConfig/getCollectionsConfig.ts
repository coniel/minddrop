import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import { CollectionsConfigDir, CollectionsConfigFileName } from '../constants';
import { hasCollectionsConfig } from '../hasCollectionsConfig';
import { CollectionsConfig } from '../types';

/**
 * Fetches the user's collections config from the config file.
 *
 * @returns The user's collections config.
 *
 * @throws {FileNotFoundError} - Collections config file not found.
 * @throws {JsonParseError} - Failed to parse collections config file.
 */
export async function getCollectionsConfig(): Promise<CollectionsConfig> {
  // Stringified JSON config
  let stringConfig = '';

  // Ensure collection configs file exists
  if (!(await hasCollectionsConfig())) {
    throw new FileNotFoundError(CollectionsConfigFileName);
  }

  try {
    // Read collection paths from configs file
    stringConfig = await Fs.readTextFile(CollectionsConfigFileName, {
      baseDir: CollectionsConfigDir,
    });

    // Parse and return the config
    return JSON.parse(stringConfig);
  } catch {
    throw new JsonParseError(stringConfig);
  }
}
