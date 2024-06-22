import { WebpageMetadata } from './WebpageMetadata.types';

export interface BackendUtilsApi {
  /**
   * Retrieves metada data for a webdocument.
   *
   * @param url - The webdocument URL.
   * @returns The webdocument metadata.
   */
  getWebpageMedata(url: string): Promise<WebpageMetadata>;
}
