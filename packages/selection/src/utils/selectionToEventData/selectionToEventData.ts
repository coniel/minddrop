import { SELECTION_DATA_KEY } from '../../constants';
import { getSelection } from '../../getSelection';

export interface EventData {
  'text/plain'?: string;
  'text/html'?: string;
  'text/uri-list'?: string;
  Files?: File[];
  'application/minddrop-selection'?: string;
}

/**
 * Converts the current selection to an object that can be used as
 * the data for a `ClipboardEvent` or a `DropEvent`.
 *
 * @returns An object containing the formatted selection data.
 */
export function selectionToEventData(): EventData {
  const eventData: EventData = {};
  const selection = getSelection();

  // Combine the plain text data into a single string
  // and set it as 'text/plain'.
  eventData['text/plain'] = selection
    .map((item) => item.getPlainTextContent?.())
    .filter((textContent) => textContent !== undefined)
    .join('\n\n');

  // Combine the HTML text data into a single string
  // and set it as 'text/html'.
  eventData['text/html'] = selection
    .map((item) => item.getHtmlTextContent?.())
    .filter((htmlContent) => htmlContent !== undefined)
    .join('\n\n');

  // Combine the URIs into a single string
  // and set it as 'text/uri-list'.
  eventData['text/uri-list'] = selection
    .map((item) => item.getUriList?.())
    .filter((uriList) => uriList !== undefined)
    .join('\n');

  // Combine all the files into a single array
  // and set it as 'Files'.
  eventData.Files = selection
    .map((item) => item.getFiles?.())
    .reduce<File[]>(
      (allFiles, files) => (files ? allFiles.concat(files) : allFiles),
      [],
    );

  // Combine the item data into a single object
  // and set it as the selection data key.
  eventData[SELECTION_DATA_KEY] = JSON.stringify(
    selection
      .map((item) => item.getData?.())
      .filter((data) => data !== undefined),
  );

  // Remove any empty string properties
  Object.entries(eventData).forEach(([key, value]) => {
    if (value === '' || value === '[]') {
      delete eventData[key as keyof EventData];
    }
  });

  // Remove Files if it is empty
  if (eventData.Files?.length === 0) {
    delete eventData.Files;
  }

  return eventData;
}
