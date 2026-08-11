import { Fs } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { readDesign } from '../readDesign';
import { resolveDesignsDirPath } from '../utils';

/**
 * Initializes designs by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDesigns(): Promise<void> {
  // Ensure the designs directory exists before attempting to read it
  if (!(await Fs.exists(resolveDesignsDirPath()))) {
    return;
  }

  // Read the entries in the designs directory
  const entries = await Fs.readDir(resolveDesignsDirPath());

  // Read a design from each entry, discarding entries which are
  // not design bundles
  const designs = await Promise.all(
    entries.map((entry) => readDesign(entry.path)),
  );

  // Load designs into the store
  DesignsStore.load(designs.filter((design) => design !== null));
}
