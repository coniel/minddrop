import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { selectionToEventData } from './selectionToEventData';

describe('selectionToEventData', () => {
  beforeEach(() => {
    setup();

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedDrop2, selectedTopic1]);
  });

  afterEach(cleanup);

  it('groups items by resource and stringifies the arrays', () => {
    // Should group items into stringified arrays
    expect(selectionToEventData()).toEqual({
      [`minddrop-selection/${selectedDrop1.resource}`]: JSON.stringify([
        selectedDrop1,
        selectedDrop2,
      ]),
      [`minddrop-selection/${selectedTopic1.resource}`]: JSON.stringify([
        selectedTopic1,
      ]),
    });
  });
});
