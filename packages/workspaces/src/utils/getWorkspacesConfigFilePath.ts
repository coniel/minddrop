import { BaseDirectory, Fs } from '@minddrop/file-system';
import { WorkspacesConfigFileName } from '../constants';

/**
 * Returns the path to the workspaces config file inside the app config directory.
 *
 * @returns The path to the workspaces config file.
 */
export function getWorkspacesConfigFilePath(): string {
  return Fs.concatPath(
    Fs.getBaseDirPath(BaseDirectory.AppConfig),
    WorkspacesConfigFileName,
  );
}
