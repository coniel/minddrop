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

  it('returns `true` if `selectionItems` contains the resource type', () => {
    // Check if contains 'drops:drop' items
    const result = selectionContains(
      [selectedDrop1, selectedTopic1],
      'drops:drop',
    );

    // Should return `true`
    expect(result).toBe(true);
  });

  it('returns `false` if `selectionItems` does not contain the resource type', () => {
    // Check if contains 'topics:topic' items
    const result = selectionContains([selectedDrop1], ['topics:topic']);

    // Should return `false`
    expect(result).toBe(false);
  });

  it('returns `false` if `selectionItems` is empty', () => {
    // Check if an empty array contains 'topics:topic' items
    const result = selectionContains([], ['topics:topic']);

    // Should return `false`
    expect(result).toBe(false);
  });

  describe('exclusive', () => {
    it('returns `false` if `selectionContains` cotains other resource types', () => {
      // Check if contains exculisvely 'topics:topic' items
      const result = selectionContains(
        [selectedTopic1, selectedDrop1],
        'topics:topic',
        true,
      );

      // Should return `false`
      expect(result).toBe(false);
    });

    it('returns `true` if `selectionItems` cotains no other resource types', () => {
      // Check if contains exclusively 'drops:drop' items
      const result = selectionContains(
        [selectedDrop1, selectedDrop2],
        'drops:drop',
        true,
      );

      // Should return `true`
      expect(result).toBe(true);
    });

    it('returns `false` if `selectionItems` is empty', () => {
      // Check if empty array contains exclusively 'topics:topic' items
      const result = selectionContains([], 'topics:topic', true);

      // Should return `false`
      expect(result).toBe(false);
    });
  });
});
