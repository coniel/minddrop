import {
  setup,
  cleanup,
  selectedDrop1,
  selectedTopic1,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { setClipboardData } from './setClipboardData';

describe('setClipboardData', () => {
  let data: Record<string, string> = {};
  const clipboardEvent = {
    preventDefault: jest.fn(),
    clipboardData: {
      clearData: jest.fn(),
      setData: (key: string, value: string) => {
        data[key] = value;
      },
    },
  } as unknown as React.ClipboardEvent;

  beforeEach(() => {
    setup();

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);
  });

  afterEach(() => {
    cleanup();

    // Clear the data
    data = {};
    // Clear mocks
    jest.clearAllMocks();
  });

  it('clears the default clipboard data', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should clear the default clipboard data
    expect(clipboardEvent.clipboardData.clearData).toHaveBeenCalled();
  });

  it('sets the action on the event', () => {
    // Set clipboard data with an action of 'move'
    setClipboardData(clipboardEvent, 'move');

    // Should set the 'minddrop/action' data to 'move'
    expect(data['minddrop/action']).toBe('move');
  });

  it('sets the selection data', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should set the current selection items grouped
    // by resource.
    expect(data[`minddrop-selection/${selectedDrop1.resource}`]).toEqual(
      JSON.stringify([selectedDrop1]),
    );
    expect(data[`minddrop-selection/${selectedTopic1.resource}`]).toEqual(
      JSON.stringify([selectedTopic1]),
    );
  });
});
