import {
  BaseDirectory,
  FileNotFoundError,
  Fs,
  JsonParseError,
} from '@minddrop/core';
import { WorkspacesConfigFile } from '../constants';
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
    throw new FileNotFoundError(WorkspacesConfigFile);
  }

  try {
    // Read workspace paths from configs file
    stringConfig = await Fs.readTextFile(WorkspacesConfigFile, {
      dir: BaseDirectory.AppConfig,
    });

    // Parse and return the config
    return JSON.parse(stringConfig);
  } catch {
    throw new JsonParseError(stringConfig);
  }
}
