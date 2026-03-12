import { BaseDirectory, Fs } from '@minddrop/file-system';

/**
 * Returns the full path to the app config directory
 * (e.g. `~/.config/MindDrop`). Used for MiniSearch
 * index persistence.
 */
export function getSearchConfigPath(): string {
  return Fs.getBaseDirPath(BaseDirectory.AppConfig);
}
