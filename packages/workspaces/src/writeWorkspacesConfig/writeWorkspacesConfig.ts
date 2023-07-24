import { Fs } from '@minddrop/core';
import { WorkspacesConfigFile } from '../constants';
import { WorkspacesStore } from '../WorkspacesStore';

/**
 * Persists workspaces config by writing store values
 * to the workspaces config file.
 */
export async function writeWorkspacesConfig(): Promise<void> {
  const fileContents = {
    paths: WorkspacesStore.getState().workspaces.map(
      (workspace) => workspace.path,
    ),
  };

  // Write config file
  await Fs.writeTextFile(WorkspacesConfigFile, JSON.stringify(fileContents), {
    dir: 'app-config',
  });
}
