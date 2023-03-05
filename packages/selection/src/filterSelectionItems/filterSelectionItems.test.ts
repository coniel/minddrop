import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedTopic1,
  selectedRichTextElement1,
} from '../test-utils';
import { filterSelectionItems } from './filterSelectionItems';

// The items to filter
const items = [selectedDrop1, selectedTopic1, selectedRichTextElement1];

describe('filterSelectionItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the selected resources matching the given type', () => {
    // Should return drops
    expect(filterSelectionItems(items, 'drop')).toEqual([selectedDrop1]);
  });

  it('returns the selected resources matching the given types', () => {
    // Should return drops and topics
    expect(filterSelectionItems(items, ['drop', 'topic'])).toEqual([
      selectedDrop1,
      selectedTopic1,
    ]);
  });
});
