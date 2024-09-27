export interface BackendUtilsAdapter {
  /**
   * Retrieves the HTML content of a webdocument.
   *
   * @param url - The webdocument URL.
   * @returns The webdocument HTML content.
   */
  getWebpageHtml(url: string): Promise<string>;
}
