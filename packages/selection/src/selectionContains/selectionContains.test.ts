import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
} from '../test-utils';
import { selectionContains } from './selectionContains';

describe('selectionContains', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns `true` if `selectionItems` contains the item type', () => {
    // Check if contains 'drop' items
    const result = selectionContains([selectedDrop1, selectedTopic1], 'drop');

    // Should return `true`
    expect(result).toBe(true);
  });

  it('returns `false` if `selectionItems` does not contain the item type', () => {
    // Check if contains 'topic' items
    const result = selectionContains([selectedDrop1], ['topic']);

    // Should return `false`
    expect(result).toBe(false);
  });

  it('returns `false` if `selectionItems` is empty', () => {
    // Check if an empty array contains 'topic' items
    const result = selectionContains([], ['topic']);

    // Should return `false`
    expect(result).toBe(false);
  });

  describe('exclusive', () => {
    it('returns `false` if `selectionContains` cotains other item types', () => {
      // Check if contains exculisvely 'topic' items
      const result = selectionContains(
        [selectedTopic1, selectedDrop1],
        'topic',
        true,
      );

      // Should return `false`
      expect(result).toBe(false);
    });

    it('returns `true` if `selectionItems` cotains no other item types', () => {
      // Check if contains exclusively 'drop' items
      const result = selectionContains(
        [selectedDrop1, selectedDrop2],
        'drop',
        true,
      );

      // Should return `true`
      expect(result).toBe(true);
    });

    it('returns `false` if `selectionItems` is empty', () => {
      // Check if empty array contains exclusively 'topic' items
      const result = selectionContains([], 'topic', true);

      // Should return `false`
      expect(result).toBe(false);
    });
  });
});
