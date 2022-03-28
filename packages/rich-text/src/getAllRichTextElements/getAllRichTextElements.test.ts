import { isEqual } from '@minddrop/utils';
import {
  setup,
  cleanup,
  richTextElementIds,
  richTextBlockElements,
} from '../test-utils';
import { getAllRichTextElements } from './getAllRichTextElements';

describe('getAllRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all rich text elements', () => {
    // Get all elements
    const elements = getAllRichTextElements();

    // Should return all rich text elements
    expect(isEqual(Object.keys(elements), richTextElementIds)).toBeTruthy();
  });

  it('filters the returned elements', () => {
    // Get all 'heading-1' elements
    const headingElements = getAllRichTextElements({
      type: ['heading-1'],
    });

    // Get the IDs of all test 'heading-1' elements
    const headingIds = richTextBlockElements
      .filter((element) => element.type === 'heading-1')
      .map((element) => element.id);

    // Should return all 'heading-1' elements
    expect(isEqual(Object.keys(headingElements), headingIds)).toBeTruthy();
  });
});
