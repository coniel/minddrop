import { MindDropDataKey } from '../constants';
import { isUrl } from '../isUrl';

export interface StandardTransferDataTypes {
  /**
   * The plain text.
   */
  'text/plain'?: string;

  /**
   * The HTML.
   */
  'text/html'?: string;

  /**
   * The URLs, from a URI list or a plain text URL.
   */
  urls?: string[];

  /**
   * The transferred files.
   */
  files?: File[];
}

/**
 * Transfer data, keyed by type without the MindDrop data key prefix
 * and JSON suffix.
 */
export type TransferData<TCustom = object> = StandardTransferDataTypes &
  TCustom;

/**
 * Parses raw transfer data entries into transfer data, keyed by
 * their types without the MindDrop data key prefix and JSON suffix.
 * URLs are read from a `text/uri-list` entry, or from a `text/plain`
 * entry containing a URL.
 *
 * @param entries - The raw data, keyed by transfer type.
 * @param files - The transferred files.
 * @returns The parsed transfer data.
 */
export function parseTransferData<TCustom = object>(
  entries: Record<string, string>,
  files: File[] = [],
): TransferData<TCustom> {
  // The parsed data, keyed by type
  const data: Record<string, unknown> = {};

  // Parse every entry
  Object.entries(entries).forEach(([type, rawData]) => {
    // The entry's key and whether its data is JSON
    let isJson = false;
    let key = type;

    // Check if the type has the MindDrop data key prefix. If so,
    // strip it.
    if (key.includes(MindDropDataKey)) {
      key = key.split(`${MindDropDataKey}.`)[1];
    }

    // Check if the type has the JSON suffix. If so, strip it and
    // mark the data as JSON.
    if (key.includes('+json')) {
      key = key.split('+json')[0];
      isJson = true;
    }

    // Skip an empty non-JSON value
    if (!isJson && !rawData) {
      return;
    }

    // Add the data, parsing it when JSON
    try {
      data[key] = isJson ? JSON.parse(rawData) : rawData;
    } catch (error) {
      // Keep the data as a string if it fails to parse
      console.warn(`Failed to parse JSON for type "${type}":`, error);
      data[key] = rawData;
    }
  });

  // Add the files when there are any
  if (files.length > 0) {
    data.files = files;
  }

  // Check for a `text/uri-list` entry. If present, parse it into
  // URLs.
  if (data['text/uri-list']) {
    // Split the list on either line ending and keep its valid URLs
    const uriList = data['text/uri-list'] as string;
    const urls = uriList
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter((url) => url && !url.startsWith('#') && isUrl(url));

    // Add the URLs when there are any
    if (urls.length > 0) {
      data.urls = urls;
    }
  }

  // Check for a `text/plain` string entry. If present, read it as a
  // URL.
  if (data['text/plain'] && typeof data['text/plain'] === 'string') {
    // Trim the text
    const plainText = (data['text/plain'] as string).trim();

    // Check if the text is a URL and no URLs were listed. If so, add
    // it.
    if (isUrl(plainText) && !data.urls) {
      data.urls = [plainText];
    }
  }

  return data as TransferData<TCustom>;
}
