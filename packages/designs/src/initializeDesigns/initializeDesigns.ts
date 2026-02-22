import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DesignsStore } from '../DesignsStore';
import { defaultDesigns } from '../default-designs';
import { readDesign } from '../readDesign';

/**
 * Initializes designs by reading them from the file system
 * and loading them into the store.
 */
export async function initializeDesigns(): Promise<void> {
  // Load default designs into the store
  DesignsStore.load(defaultDesigns);

  // Ensure the designs directory exists before attempting to read it
  if (!(await Fs.exists(Paths.designs))) {
    return;
  }

  // Read designs from the file system
  const designPaths = await Fs.readDir(Paths.designs);
  const designs = await Promise.all(
    designPaths.map(async (entry) => readDesign(entry.path)),
  );

  // Load designs into the store
  DesignsStore.load(designs.filter((design) => design !== null));
}
