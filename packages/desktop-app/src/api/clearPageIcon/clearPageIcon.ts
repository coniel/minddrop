import { UserIconType } from '@minddrop/icons';
import { Pages } from '@minddrop/pages';

/**
 * Clears a pages's icon, resetting it to the default
 * icon.
 *
 * @param path - The page path.
 */
export async function clearPageIcon(path: string): Promise<void> {
  Pages.setIcon(path, { type: UserIconType.Default });
}
