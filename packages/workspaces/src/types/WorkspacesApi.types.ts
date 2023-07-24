import { Core } from '@minddrop/core';
import { Workspace } from './Workspace.types';

export interface WorkspacesApi {
  /**
   * Loads workspaces from the workspaces configs file and
   * verifies that each workspace path exists.
   *
   * Dispatches a 'workspaces:load' event.
   *
   * @param core - A MindDrop core instance.
   * @returns The loaded workspaces.
   */
  load(core: Core): Promise<Workspace[]>;

  /**
   * Adds a new workspace to the store and workspaces config file.
   * Emits a 'workspaces:workspace:add' event.
   *
   * @param path - Absolute path to the workspace directory.
   * @returns The new workspace.
   */
  add(core: Core, path: string): Promise<Workspace>;
}
