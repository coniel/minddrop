import { WebpageMetadata } from '@minddrop/utils';
import axios from 'axios';
import { extractOpenGraph } from '@devmehq/open-graph-extractor';
import { getDomain } from 'tldts';

/**
 * Retrieves metada data for a webpage.
 *
 * @param url - The webpage URL.
 * @returns The webpage metadata.
 */
export async function getWebpageMetadata(
  url: string,
): Promise<WebpageMetadata> {
  // Get the URL's domain
  const domain = getDomain(url);

  // Default metadata consists of the domain and the
  // title, which defaults to the domain.
  const defaultMetadata = {
    domain,
    title: domain,
  };

  try {
    // Get the webpage HTML
    const { data: html } = await axios.get(url, { timeout: 5000 });

    // Extract metadata from the HTML
    const metadata = await extractOpenGraph(html, {
      customMetaTags: [
        { multiple: false, property: 'description', fieldName: 'description' },
      ],
    });

    // Return the metadata or default metadata if metadata
    // could not be extracted.
    return metadata
      ? {
          domain,
          title: metadata.ogTitle || domain,
          // Prefer meta description over OG description
          description: metadata.description || metadata.ogDescription,
          image: metadata.ogImage ? metadata.ogImage.url : undefined,
        }
      : defaultMetadata;
  } catch (error) {
    // Return default metadata in case of failure
    return defaultMetadata;
  }
}
