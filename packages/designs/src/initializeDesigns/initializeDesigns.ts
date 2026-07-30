import { Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension } from '../constants';
import { readDesign } from '../readDesign';
import { getDesignsDirPath } from '../utils';

/**
 * Initializes designs by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDesigns(): Promise<void> {
  // Ensure the designs directory exists before attempting to read it
  if (!(await Fs.exists(getDesignsDirPath()))) {
    return;
  }

  // Read design files from the designs directory
  const entries = await Fs.readDir(getDesignsDirPath());
  const designs = await Promise.all(
    entries
      .filter((entry) => Fs.getExtension(entry.path) === DesignFileExtension)
      .map((entry) => readDesign(entry.path)),
  );

  // Load designs into the store
  DesignsStore.load(designs.filter((design) => design !== null));
}
