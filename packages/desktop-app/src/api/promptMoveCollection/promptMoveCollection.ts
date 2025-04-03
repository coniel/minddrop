import { open } from '@tauri-apps/plugin-dialog';
import { Collections } from '@minddrop/collections';

/**
 * Opens a directory selection dialog and moves the collection
 * at with the specified path to the selected directory.
 *
 * @param path - The target workspac path.
 */
export async function promptMoveCollection(path: string): Promise<void> {
  // Open a selection dialog for a directory
  const selected = await open({
    multiple: false,
    directory: true,
  });

  if (typeof selected === 'string') {
    // Move the the collection to the selected directory
    return await Collections.move(path, selected);
  }
}
