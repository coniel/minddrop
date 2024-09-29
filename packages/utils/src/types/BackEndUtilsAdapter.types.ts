export interface BackendUtilsAdapter {
  /**
   * Opens a file or link with the default application.
   *
   * @param path - The path or url top open.
   * @param openWith - The application to open the file or directory with.
   */
  open(path: string, openWith?: string): Promise<void>;

  /**
   * Retrieves the HTML content of a webdocument.
   *
   * @param url - The webdocument URL.
   * @returns The webdocument HTML content.
   */
  getWebpageHtml(url: string): Promise<string>;
}
