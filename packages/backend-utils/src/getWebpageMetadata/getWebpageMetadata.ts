import getMetadata from 'metadata-scraper';
import { WebpageMetadata } from '@minddrop/utils';

/**
 * Retrieves metada data for a webpage.
 *
 * @param url - The webpage URL.
 * @returns The webpage metadata.
 */
export function getWebpageMetadata(url: string): Promise<WebpageMetadata> {
  return getMetadata(url);
}
