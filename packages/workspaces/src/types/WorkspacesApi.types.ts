import { Workspace } from './Workspace.types';
import { WorkspacesConfig } from './WorkspacesConfig.types';

export interface WorkspacesApi {
  /**
   * Loads workspaces from the workspaces configs file and
   * verifies that each workspace path exists.
   *
   * Dispatches a 'workspaces:load' event.
   *
   * @returns The loaded workspaces.
   */
  load(): Promise<Workspace[]>;

  /**
   * Adds a new workspace to the store and workspaces config file.
   * Emits a 'workspaces:workspace:add' event.
   *
   * @param path - Absolute path to the workspace directory.
   * @returns The new workspace.
   */
  add(path: string): Promise<Workspace>;

  /**
   * Returns all of the user's workspaces.
   *
   * @returns The users workspaces.
   */
  getAll(): Workspace[];

  /**
   * Fetches the user's workspaces config from the config file.
   *
   * @returns The user's workspaces config.
   *
   * @throws {FileNotFoundError} - Workspaces config file not found.
   * @throws {JsonParseError} - Failed to parse workspaces config file.
   */
  getConfig(): Promise<WorkspacesConfig>;

  /**
   * Checks if the workspaces config file exists.
   *
   * @returns boolean indicating whether the file exists.
   */
  hasConfig(): Promise<boolean>;

  /**
   * Checks if there is at least one workspace for which the directory
   * exists.
   *
   * @returns A boolean indicating the existence of a valid workspace.
   */
  hasValidWorkspace(): boolean;

  /**
   * Checks whether a workspace directory exists.
   *
   * @params path - The workspace path.
   * @returns Boolean indicating whether the workspace exists.
   */
  exists(path: string): Promise<boolean>;
}
