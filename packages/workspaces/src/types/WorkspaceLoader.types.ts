import { Workspace } from './Workspace.types';

/**
 * Loads a workspace's content into the stores. Loaders are registered
 * by the app and run in registration order when a workspace loads.
 */
export interface WorkspaceLoader {
  /**
   * A unique identifier for the loader.
   */
  id: string;

  /**
   * Loads the workspace's content.
   *
   * @param workspace - The workspace to load.
   */
  load(workspace: Workspace): Promise<void>;
}
