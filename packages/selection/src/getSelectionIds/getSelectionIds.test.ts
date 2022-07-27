import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
  selectedTopic2,
  selectedRichTextElement1,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { getSelectionIds } from './getSelectionIds';

describe('getSelectionIds', () => {
  beforeEach(() => {
    setup();

    // Selected drops and topics
    useSelectionStore
      .getState()
      .addSelectedItems([
        selectedDrop1,
        selectedDrop2,
        selectedTopic1,
        selectedTopic2,
        selectedRichTextElement1,
      ]);
  });

  afterEach(cleanup);

  describe('without parameters', () => {
    it('returns the IDs of the entire selection', () => {
      // Should return the IDs of the entire selection
      expect(getSelectionIds()).toEqual([
        selectedDrop1.id,
        selectedDrop2.id,
        selectedTopic1.id,
        selectedTopic2.id,
        selectedRichTextElement1.id,
      ]);
    });
  });

  describe('with resource type filter', () => {
    it('returns the IDs of selected resources matching the given type', () => {
      // Should return the IDs of  selected drops
      expect(getSelectionIds('drops:drop')).toEqual([
        selectedDrop1.id,
        selectedDrop2.id,
      ]);
    });

    it('returns the IDs of selected resources matching the given types', () => {
      // Should return the IDs of selected drops and topics
      expect(getSelectionIds(['drops:drop', 'topics:topic'])).toEqual([
        selectedDrop1.id,
        selectedDrop2.id,
        selectedTopic1.id,
        selectedTopic2.id,
      ]);
    });
  });
});
