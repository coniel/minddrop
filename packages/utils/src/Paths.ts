let httpServerHost = '';

export const Paths = {
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
