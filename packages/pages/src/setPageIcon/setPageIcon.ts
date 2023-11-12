import { UserIcon } from '@minddrop/icons';
import { PagesStore } from '../PagesStore';
import { writePageMetadata } from '../writePageMetadata';

/**
 * Sets the page icon and persists the change to the
 * page file metadata.
 *
 * @param path - The page path.
 * @param icon - The new icon.
 */
export async function setPageIcon(path: string, icon: UserIcon): Promise<void> {
  // Update the page in the store
  PagesStore.getState().update(path, { icon });

  // Persist the change to the page file metadata
  await writePageMetadata(path);
}
