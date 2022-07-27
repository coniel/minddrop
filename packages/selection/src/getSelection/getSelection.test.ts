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
import { getSelection } from './getSelection';

describe('getSelection', () => {
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
    it('returns the entire selection', () => {
      // Should return the entire selection
      expect(getSelection()).toEqual([
        selectedDrop1,
        selectedDrop2,
        selectedTopic1,
        selectedTopic2,
        selectedRichTextElement1,
      ]);
    });
  });

  describe('with resource type filter', () => {
    it('returns the selected resources matching the given type', () => {
      // Should return selected drops
      expect(getSelection('drops:drop')).toEqual([
        selectedDrop1,
        selectedDrop2,
      ]);
    });

    it('returns the selected resources matching the given types', () => {
      // Should return selected drops and topics
      expect(getSelection(['drops:drop', 'topics:topic'])).toEqual([
        selectedDrop1,
        selectedDrop2,
        selectedTopic1,
        selectedTopic2,
      ]);
    });
  });
});
