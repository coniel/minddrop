import {
  setup,
  cleanup,
  selectedDrop1,
  selectedTopic1,
  core,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { copySelection } from './copySelection';

describe('copySelection', () => {
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

    data = {};
  });

  it('sets the clipboard data', () => {
    // Trigger a copy
    copySelection(core, clipboardEvent);

    // Should set the clipboard data
    expect(data[`minddrop-selection/${selectedDrop1.resource}`]).toEqual(
      JSON.stringify([selectedDrop1]),
    );
  });

  it('dispatches a `selection:clipboard:copy` event', (done) => {
    // Listen to 'selection:clipboard:copy' events
    core.addEventListener('selection:clipboard:copy', (payload) => {
      // Payload data should contain the event
      expect(payload.data.event).toEqual(clipboardEvent);
      // Payload data should contain the selection
      expect(payload.data.selection).toEqual([selectedDrop1, selectedTopic1]);
      done();
    });

    // Trigger a copy
    copySelection(core, clipboardEvent);
  });
});
