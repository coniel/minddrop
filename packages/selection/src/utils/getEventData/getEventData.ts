import { isUrl } from '@minddrop/utils';
import { MindDropDataKey } from '../../constants';

interface StandardDataTypes {
  'text/plain'?: string;
  'text/html'?: string;
  urls?: string[];
  files?: File[];
}

type DataTypes<TCustom = {}> = StandardDataTypes & TCustom;

/**
 * Returns the data from a drag event or clipboard event, removing the
 * MindDrop data key prefix and JSON suffix if present.
 *
 * @param event - The drag event or clipboard event.
 * @returns The data from the event.
 */
export function getEventData<TCustom = {}>(
  event: React.DragEvent | React.ClipboardEvent,
): DataTypes<TCustom> {
  const dataTransfer =
    'dataTransfer' in event ? event.dataTransfer : event.clipboardData;

  const data: Record<string, unknown> = {};

  for (const type of dataTransfer.types) {
    // Skip Files type as it's handled separately below
    if (type === 'Files') {
      continue;
    }

    let isJson = false;
    let key = type;

    // Check if the data key is using the MindDrop mime type format
    if (key.includes(MindDropDataKey)) {
      key = key.split(`${MindDropDataKey}.`)[1];
    }

    // Check if the data is JSON
    if (key.includes('+json')) {
      key = key.split('+json')[0];
      isJson = true;
    }

    // Get the raw data
    const rawData = dataTransfer.getData(type);

    // Skip empty strings (but allow other falsy values from JSON)
    if (!isJson && !rawData) {
      continue;
    }

    // Add the data to the object, parsing it if needed
    try {
      data[key] = isJson ? JSON.parse(rawData) : rawData;
    } catch (error) {
      // If JSON parsing fails, store as string
      console.warn(`Failed to parse JSON for type "${type}":`, error);
      data[key] = rawData;
    }
  }

  // Add files if present
  if (dataTransfer.files && dataTransfer.files.length > 0) {
    data.files = Array.from(dataTransfer.files);
  }

  // Parse text/uri-list into URLs array
  if (data['text/uri-list']) {
    const uriList = data['text/uri-list'] as string;
    const urls = uriList
      .split(/\r?\n/) // Handle both Windows (\r\n) and Unix (\n) line endings
      .map((url) => url.trim())
      .filter((url) => url && !url.startsWith('#') && isUrl(url));

    if (urls.length > 0) {
      data.urls = urls;
    }
  }

  // Check if text/plain is a URL
  if (data['text/plain'] && typeof data['text/plain'] === 'string') {
    const plainText = (data['text/plain'] as string).trim();

    if (isUrl(plainText)) {
      // Only set if urls doesn't already exist (text/uri-list takes precedence)
      if (!data.urls) {
        data.urls = [plainText];
      }
    }
  }

  return data as DataTypes<TCustom>;
}
