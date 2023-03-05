import { describe, beforeEach, afterEach, it, expect } from 'vitest';
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
import { getSelectionPaths } from './getSelectionPaths';

describe('getSelectionPaths', () => {
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
    it('returns the paths of the entire selection', () => {
      // Should return the paths of the entire selection
      expect(getSelectionPaths()).toEqual([
        selectedDrop1.path,
        selectedDrop2.path,
        selectedTopic1.path,
        selectedTopic2.path,
        selectedRichTextElement1.path,
      ]);
    });
  });

  describe('with resource type filter', () => {
    it('returns the paths of selected resources matching the given type', () => {
      // Should return the paths of  selected drops
      expect(getSelectionPaths('drop')).toEqual([
        selectedDrop1.path,
        selectedDrop2.path,
      ]);
    });

    it('returns the paths of selected resources matching the given types', () => {
      // Should return the paths of selected drops and topics
      expect(getSelectionPaths(['drop', 'topic'])).toEqual([
        selectedDrop1.path,
        selectedDrop2.path,
        selectedTopic1.path,
        selectedTopic2.path,
      ]);
    });
  });
});
