import { Core, FileNotFoundError, Fs } from '@minddrop/core';
import { WorkspacesConfigFile } from '../constants';
import { getWorkspaceFromPath } from '../getWorkspaceFromPath';
import { Workspace, WorkspacesConfig } from '../types';
import { WorkspacesStore } from '../WorkspacesStore';

/**
 * Loads workspaces from the workspaces configs file and
 * verifies that each workspace path exists.
 *
 * Dispatches a 'workspaces:load' event.
 *
 * @param core - A MindDrop core instance.
 * @returns The loaded workspaces.
 */
export async function loadWorkspaces(core: Core): Promise<Workspace[]> {
  let workspacesConfig: WorkspacesConfig;

  // Check if workspace configs file exists
  const exists = await Fs.exists(WorkspacesConfigFile, { dir: 'app-config' });

  if (!exists) {
    throw new FileNotFoundError(WorkspacesConfigFile);
  }

  try {
    // Read workspace paths from configs file
    const stringConfig = await Fs.readTextFile(WorkspacesConfigFile, {
      dir: 'app-config',
    });

    // Parse the config
    workspacesConfig = JSON.parse(stringConfig);
  } catch {
    throw new Error(`Unable to parse ${WorkspacesConfigFile}`);
  }

  // Create workspace obejcts
  const workspaces: Workspace[] = await Promise.all(
    workspacesConfig.paths.map(getWorkspaceFromPath),
  );

  // Load workspace paths into store
  WorkspacesStore.getState().load(workspaces);

  // Dispatch a 'workspaces:load' event
  core.dispatch('workspaces:load', workspaces);

  return workspaces;
}
