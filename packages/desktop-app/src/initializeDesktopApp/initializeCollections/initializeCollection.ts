import { Collections } from '@minddrop/collections';
import { FileNotFoundError } from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';

/**
 * Initializes collections by loading them from the collections
 * config file.
 *
 * If the file does not exist or could not be parsed, the collections
 * config file will be re-initialized.
 */
export async function initializeCollections() {
  try {
    // Load collections from the collections config file
    await Collections.load();
  } catch (error) {
    // Failed to load collections config file. Open the
    // 'create-first-collection' view which will re-initialize
    // the config file.
    if (error instanceof FileNotFoundError || error instanceof JsonParseError) {
      await Collections.initializeConfig();
    }
  }
}
