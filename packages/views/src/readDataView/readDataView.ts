import { Fs } from '@minddrop/file-system';
import { DataView } from '../types';

/**
 * Reads a data view from the file system.
 *
 * @param path - The path to the data view file.
 * @returns The data view or null if it doesn't exist.
 */
export async function readDataView(path: string): Promise<DataView | null> {
  try {
    // Read and parse the data view file
    const view = await Fs.readJsonFile<DataView>(path);

    return view;
  } catch {
    return null;
  }
}
