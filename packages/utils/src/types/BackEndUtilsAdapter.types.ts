export interface BackendUtilsAdapter {
  /**
   * Opens a file with the default application.
   *
   * @param path - The path or url top open.
   * @param openWith - The application to open the file or directory with.
   */
  openFile(path: string, openWith?: string): Promise<void>;

  /**
   * Opens a URL with the default browser.
   *
   * @param url - The URL to open.
   */
  openUrl(url: string): Promise<void>;

  /**
   * Shows a file or directory in the file explorer.
   *
   * @param path - The path to the item.
   */
  showItemInFolder(path: string): Promise<void>;

  /**
   * Retrieves the HTML content of a webdocument.
   *
   * @param url - The webdocument URL.
   * @returns The webdocument HTML content.
   */
  getWebpageHtml(url: string): Promise<string>;
}
