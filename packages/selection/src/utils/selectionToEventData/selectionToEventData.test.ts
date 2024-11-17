import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItemWithoutCallbacks,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { selectionToEventData } from './selectionToEventData';
import { SELECTION_DATA_KEY } from '../../constants';

describe('selectionToEventData', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([
        selectedItem1,
        selectedItem2,
        selectedItemWithoutCallbacks,
      ]);
  });

  afterEach(cleanup);

  it('combines plain text data into text/plain', () => {
    const eventData = selectionToEventData();

    // Should merge the plain text data into a single string
    // and set it as 'text/plain'.
    expect(eventData['text/plain']).toBe(
      `${selectedItem1.getPlainTextContent()}\n\n${selectedItem2.getPlainTextContent()}`,
    );
  });

  it('combines HTML data into text/html', () => {
    const eventData = selectionToEventData();
    // Should merge the HTML data into a single string
    // and set it as 'text/html'.
    expect(eventData['text/html']).toBe(
      `${selectedItem1.getHtmlTextContent()}\n\n${selectedItem2.getHtmlTextContent()}`,
    );
  });

  it('combines URIs into text/uri-list', () => {
    const eventData = selectionToEventData();
    // Should merge the URIs into a single string
    // and set it as 'text/uri-list'.
    expect(eventData['text/uri-list']).toBe(
      `${selectedItem1.getUriList()}\n${selectedItem2.getUriList()}`,
    );
  });

  it('combines files into into Files', () => {
    const eventData = selectionToEventData();
    // Should combine all the files into a single array
    // and set it as 'Files'.
    expect(eventData.Files).toEqual([
      ...selectedItem1.getFiles(),
      ...selectedItem2.getFiles(),
    ]);
  });

  it('combines item data into selection data key', () => {
    const eventData = selectionToEventData();
    // Should merge the item data into a single object
    // and stringify it as selection data key.
    expect(eventData[SELECTION_DATA_KEY]).toBe(
      JSON.stringify([selectedItem1.getData(), selectedItem2.getData()]),
    );
  });

  it('removes empty values', () => {
    // Clear selection
    useSelectionStore.getState().clear();
    // Add an item without any callbacks
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItemWithoutCallbacks]);

    const eventData = selectionToEventData();

    // Should remove empty values from the event data.
    expect(eventData).toEqual({});
  });
});
