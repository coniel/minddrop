import openGraphScraper from 'open-graph-scraper-lite';
import { AdapterNotRegisteredError, InvalidParameterError } from '../errors';
import {
  BackendUtilsAdapter,
  BackendUtilsApi,
  WebpageMetadata,
} from '../types';

const placeholderApi: BackendUtilsAdapter = {
  getWebpageHtml: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
  openFile: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
  openUrl: () => {
    throw new AdapterNotRegisteredError('backend utils');
  },
  showItemInFolder: () => {
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

export async function openFile(path: string): Promise<void> {
  return backEndUtilsAdapter.openFile(path);
}

export async function openUrl(url: string): Promise<void> {
  return backEndUtilsAdapter.openUrl(url);
}

export async function showItemInFolder(path: string): Promise<void> {
  return backEndUtilsAdapter.showItemInFolder(path);
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

  const urlObject = new URL(url);

  try {
    // Get the webpage HTML
    const html = await backEndUtilsAdapter.getWebpageHtml(url);

    // Parse the Open Graph data
    const data = await openGraphScraper({ html });

    const { result } = data;

    if (result.error) {
      throw new Error(`Error getting webpage metadata: ${result.error})`);
    }

    const metadata: WebpageMetadata = {
      description: result.ogDescription,
      title: result.ogTitle || url,
      image: result.ogImage && result.ogImage[0] ? result.ogImage[0].url : '',
      domain: urlObject.hostname.replace('www.', ''),
    };

    // Add the theme color if available
    const themeColor = extractThemeColorFromHtml(html);

    if (themeColor) {
      metadata.themeColor = themeColor;
    }

    // Add the largest icon defined using a <link> tag if available.
    // Fall back to the favicon if no icon is found.
    const largestIcon = extractLargestIconFromHtml(html);

    if (largestIcon) {
      metadata.icon = getImageAbsoluteUrl(largestIcon, urlObject.origin);
    } else if (result.favicon) {
      metadata.icon = getImageAbsoluteUrl(result.favicon, urlObject.origin);
    }

    return metadata;
  } catch (error) {
    console.error(error);

    return {
      title: url,
      domain: urlObject.hostname.replace('www.', ''),
    };
  }
};

function getImageAbsoluteUrl(imageUrl: string, origin: string): string {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${origin}/${imageUrl}`;
}

export function extractThemeColorFromHtml(html: string): string | null {
  const regex =
    /<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["'][^>]*>/i;
  const match = html.match(regex);

  return match ? match[1] : null;
}

export function extractLargestIconFromHtml(html: string): string | null {
  // Matches all <link rel="icon"> tags
  const regex = /<link[^>]*rel=["']icon["'][^>]*>/gi;
  // Matches the sizes attribute
  const sizeRegex = /sizes=["']([^"']+)["']/i;
  // Matches the href attribute
  const hrefRegex = /href=["']([^"']+)["']/i;

  // Find all matching <link rel="icon"> tags
  const matches = html.match(regex);

  if (!matches) return null;

  let largestIcon = null;
  let largestSize = 0;

  for (const tag of matches) {
    const hrefMatch = tag.match(hrefRegex);
    const sizeMatch = tag.match(sizeRegex);

    // Skip if no href is found
    if (!hrefMatch) continue;

    const href = hrefMatch[1];
    let size = 0;

    // Parse size if available (e.g., "32x32")
    if (sizeMatch) {
      const sizes = sizeMatch[1].split(' ').map((s) => {
        const [width, height] = s.split('x').map(Number);

        // Multiply width and height to get the area
        return width * height || 0;
      });

      // Take the largest size for the tag
      size = Math.max(...sizes);
    }

    // Keep track of the largest icon
    if (size > largestSize || (size === largestSize && largestIcon === null)) {
      largestSize = size;
      largestIcon = href;
    }
  }

  return largestIcon;
}
