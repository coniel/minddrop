import { WebpageMetadata } from './WebpageMetadata.types';

export interface BackendUtilsApi {
  /**
   * Retrieves metada data for a webpage.
   *
   * @param url - The webpage URL.
   * @returns The webpage metadata.
   */
  getWebpageMedata(url: string): Promise<WebpageMetadata>;
}
