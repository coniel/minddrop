import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { View } from '../types';

/**
 * Reads a view config from the file system.
 *
 * @param path - The path to the view config file.
 * @returns The view.
 * @throws {FileNotFoundError} If the view config file does not exist.
 */
export async function readViewConfig(path: string): Promise<View> {
  // Ensure the view config files exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Read the view config from the file system
  const view = await Fs.readJsonFile<View>(path);

  // Add the path to the view
  return { ...restoreDates(view), path };
}
