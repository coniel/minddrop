let workspacePath = '';
let workspaceConfigsPath = '';

export const Paths = {
  /**
   * Returns the root path of the currently active workspace.
   */
  get workspacePath() {
    return workspacePath;
  },

  /**
   * Sets the root path of the currently active workspace.
   */
  set workspacePath(path: string) {
    workspacePath = path;
  },

  /**
   * Returns the path where workspace configuration files are stored
   * for the currently active workspace.
   */
  get workspaceConfigsPath() {
    return workspaceConfigsPath;
  },

  /**
   * Sets the path where workspace configuration files are stored
   * for the currently active workspace.
   */
  set workspaceConfigsPath(path: string) {
    workspaceConfigsPath = path;
  },
};
