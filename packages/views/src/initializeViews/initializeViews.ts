import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ViewsDirectory } from '../constants';
import { loadViews } from '../loadViews';

/**
 * Initializes views by loading view configs from the views directory.
 *
 * If the views directory does not exist, it will be created.
 */
export async function initializeViews(): Promise<void> {
  const viewsDirPath = Fs.concatPath(Paths.workspace, ViewsDirectory);

  // Ensure that the views directory exists
  if (!(await Fs.exists(viewsDirPath))) {
    // Create the views directory if it doesn't exist
    Fs.createDir(viewsDirPath);
  } else {
    // Load views from the views directory
    const files = await Fs.readDir(viewsDirPath);

    // Filter out files that are not view configs
    const viewFiles = files
      .filter((file) => file.path.endsWith('.view'))
      .map((file) => file.path);

    // Load the views
    await loadViews(viewFiles);
  }
}
