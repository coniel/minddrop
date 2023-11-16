import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import { WorkspacesConfigDir, WorkspacesConfigFileName } from '../constants';
import { hasWorkspacesConfig } from '../hasWorkspacesConfig';
import { WorkspacesConfig } from '../types';

/**
 * Fetches the user's workspaces config from the config file.
 *
 * @returns The user's workspaces config.
 *
 * @throws {FileNotFoundError} - Workspaces config file not found.
 * @throws {JsonParseError} - Failed to parse workspaces config file.
 */
export async function getWorkspacesConfig(): Promise<WorkspacesConfig> {
  // Stringified JSON config
  let stringConfig = '';

  // Ensure workspace configs file exists
  if (!(await hasWorkspacesConfig())) {
    throw new FileNotFoundError(WorkspacesConfigFileName);
  }

  try {
    // Read workspace paths from configs file
    stringConfig = await Fs.readTextFile(WorkspacesConfigFileName, {
      dir: WorkspacesConfigDir,
    });

    // Parse and return the config
    return JSON.parse(stringConfig);
  } catch {
    throw new JsonParseError(stringConfig);
  }
}
