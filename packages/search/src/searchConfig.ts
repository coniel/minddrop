import { BaseDirectory, Fs } from '@minddrop/file-system';

/**
 * Returns the full path to the search data directory
 * (e.g. `~/.config/MindDrop/search`).
 */
export function getSearchConfigPath(): string {
  return `${Fs.getBaseDirPath(BaseDirectory.AppConfig)}/search`;
}
