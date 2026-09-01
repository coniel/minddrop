import { BaseDirectory, Fs } from '@minddrop/file-system';

/**
 * Returns the full path to the app config directory
 * (e.g. `~/.config/MindDrop`).
 */
export function resolveSqlConfigDirPath(): string {
  return Fs.resolveBaseDirPath(BaseDirectory.AppConfig);
}
