import { FileNotFoundError } from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import { getCollectionsConfig } from '../getCollectionsConfig';
import { writeCollectionsConfig } from '../writeCollectionsConfig';

/**
 * Initializes the collections config file unless it already exists
 * and is valid.
 */
export async function initializeCollectionsConfig(): Promise<void> {
  try {
    // Fetch the user's collections config
    await getCollectionsConfig();
  } catch (error) {
    // If the collections config file does not exist or could not be
    // parsed, re-initialize the collections config file
    if (error instanceof FileNotFoundError || error instanceof JsonParseError) {
      writeCollectionsConfig();
    }
  }
}
