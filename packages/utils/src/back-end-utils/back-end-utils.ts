import openGraphScraper from 'open-graph-scraper-lite';
import { AdapterNotRegisteredError, InvalidParameterError } from '../errors';
import { BackendUtilsApi, BackendUtilsAdapter } from '../types';

const placeholderApi: BackendUtilsAdapter = {
  getWebpageHtml: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
  open: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
};

let adapterRegistered = false;
let backEndUtilsAdapter: BackendUtilsAdapter = placeholderApi;

/**
 * Registers a backend utils API adapter
 * which allows backend utils to be called
 * from the frontend.
 *
 * @param adapter - A backend utils API adapter.
 */
export function registerBackendUtilsAdapter(adapter: BackendUtilsAdapter) {
  backEndUtilsAdapter = adapter;
  adapterRegistered = true;
}

/**
 * **Intended for use in tests only.**
 *
 * Unregisters the  backend utils API adapter
 * which allows backend utils to be called
 * from the frontend.
 */
export function unregisterBackendUtilsAdapter() {
  backEndUtilsAdapter = placeholderApi;
  adapterRegistered = false;
}

export async function open(path: string, openWith?: string): Promise<void> {
  return backEndUtilsAdapter.open(path, openWith);
}

export const getWebpageMetadata: BackendUtilsApi['getWebpageMedata'] = async (
  url,
) => {
  // Ensure that the URL is a string
  if (typeof url !== 'string') {
    throw new InvalidParameterError(
      `URL must be a string, received ${typeof url}`,
    );
  }

  // Ensure that an adapter is registered
  if (!adapterRegistered) {
    throw new AdapterNotRegisteredError('BackEndUtilsAdapter');
  }

  try {
    // Get the webpage HTML
    const html = await backEndUtilsAdapter.getWebpageHtml(url);

    // Parse the Open Graph data
    const data = await openGraphScraper({ html });

    const { result } = data;

    if (result.error) {
      throw new Error(`Error getting webpage metadata: ${result.error}`);
    }

    const urlObject = new URL(url);

    return {
      description: result.ogDescription,
      title: result.ogTitle || url,
      image: result.ogImage && result.ogImage[0] ? result.ogImage[0].url : '',
      icon: result.favicon
        ? getImageAbsoluteUrl(result.favicon, urlObject.origin)
        : '',
      domain: urlObject.hostname.replace('www.', ''),
    };
  } catch (error) {
    throw new Error(`Error getting webpage metadata: ${error}`);
  }
};

function getImageAbsoluteUrl(imageUrl: string, origin: string) {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${origin}/${imageUrl}`;
}
