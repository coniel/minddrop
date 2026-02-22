let workspacePath = '';
let workspaceConfigsPath = '';
let designsPath = '';
let httpServerHost = '';

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
   * Returns the path where design files are stored for the currently active workspace.
   */
  get designs() {
    return designsPath;
  },

  /**
   * Sets the path where design files are stored for the currently active workspace.
   */
  set designs(path: string) {
    designsPath = path;
  },

  /**
   * Returns the host of the HTTP server.
   */
  get httpServerHost() {
    return httpServerHost;
  },

  /**
   * Sets the host of the HTTP server.
   */
  set httpServerHost(host: string) {
    httpServerHost = host;
  },

  /**
   * The name of the hidden directory where non-user facing files are stored.
   */
  hiddenDirName: '.minddrop',
};
