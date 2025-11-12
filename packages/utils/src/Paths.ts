let workspacePath = '';
let workspaceConfigsPath = '';

export const Paths = {
  /**
   * Returns the root path of the currently active workspace.
   */
  get workspace() {
    return workspacePath;
  },

  /**
   * Sets the root path of the currently active workspace.
   */
  set workspace(path: string) {
    workspacePath = path;
  },

  /**
   * Returns the path where workspace configuration files are stored
   * for the currently active workspace.
   */
  get workspaceConfigs() {
    return workspaceConfigsPath;
  },

  /**
   * Sets the path where workspace configuration files are stored
   * for the currently active workspace.
   */
  set workspaceConfigs(path: string) {
    workspaceConfigsPath = path;
  },

  /**
   * The name of the hidden directory where non-user facing files are stored.
   */
  hiddenDirName: '.minddrop',
};
