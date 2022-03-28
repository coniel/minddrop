import { isEqual, mapById } from '@minddrop/utils';
import {
  setup,
  cleanup,
  richTextElements,
  richTextBlockElementIds,
  headingElement1,
  richTextBlockElements,
  linkElement1,
  inlineEquationElement1,
} from '../test-utils';
import { filterRichTextElements } from './filterRichTextElements';

describe('filterRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('filters rich text elements by level', () => {
    // Get block level elements
    const blockElements = filterRichTextElements(mapById(richTextElements), {
      level: 'block',
    });

    // Should only contain block elements
    expect(
      isEqual(Object.keys(blockElements), richTextBlockElementIds),
    ).toBeTruthy();
  });

  it('filters elements by type', () => {
    // Get 'heading-1' elements
    const headings = filterRichTextElements(mapById(richTextElements), {
      type: [headingElement1.type],
    });

    // Get the IDs of all test 'heading-1' elements
    const headingIds = richTextBlockElements
      .filter((element) => element.type === 'heading-1')
      .map((element) => element.id);

    // Should only contain 'heading-1' elements
    expect(isEqual(Object.keys(headings), headingIds)).toBeTruthy();
  });

  it('filters elements by voidness', () => {
    const testElements = mapById([
      // Non-void
      linkElement1,
      // Void
      inlineEquationElement1,
    ]);

    // Get void elements
    const voidElements = filterRichTextElements(testElements, { void: true });
    // Get non-void elements
    const nonVoidElements = filterRichTextElements(testElements, {
      void: false,
    });
    // Get all elements (omitted 'void' filter test)
    const allElements = filterRichTextElements(testElements, {});

    // voidElements should only contain the void 'inline-quation' element
    expect(
      isEqual(Object.keys(voidElements), [inlineEquationElement1.id]),
    ).toBeTruthy();
    // nonVoidElements should only contain the non-void 'link' element
    expect(
      isEqual(Object.keys(nonVoidElements), [linkElement1.id]),
    ).toBeTruthy();
    // allElements should contain both of the elements
    expect(
      isEqual(Object.keys(allElements), Object.keys(testElements)),
    ).toBeTruthy();
  });

  it('filters elements by deleted status', () => {
    const testElements = mapById([
      // Not deleted
      linkElement1,
      // Deleted
      { ...inlineEquationElement1, deleted: true, deletedAt: new Date() },
    ]);

    // Get deleted elements
    const deletedElements = filterRichTextElements(testElements, {
      deleted: true,
    });
    // Get non-deleted elements
    const nonDeletedElements = filterRichTextElements(testElements, {
      deleted: false,
    });
    // Get all elements (omitted 'deleted' filter test)
    const allElements = filterRichTextElements(testElements, {});

    // deletedElements should only contain the deleted 'inline-quation' element
    expect(
      isEqual(Object.keys(deletedElements), [inlineEquationElement1.id]),
    ).toBeTruthy();
    // nonDeletedElements should only contain the non-deleted 'link' element
    expect(
      isEqual(Object.keys(nonDeletedElements), [linkElement1.id]),
    ).toBeTruthy();
    // allElements should contain both of the elements
    expect(
      isEqual(Object.keys(allElements), Object.keys(testElements)),
    ).toBeTruthy();
  });
});
