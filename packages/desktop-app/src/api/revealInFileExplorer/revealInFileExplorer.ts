import { invoke } from '@tauri-apps/api/core';

/**
 * Opens the parent directory of the specified path
 * in the OS file explorer.
 *
 * @param path - The target path.
 */
export async function revealInFileExplorer(path: string): Promise<void> {
  await invoke('show_in_folder', { path });
}
