import { doesNotContain, InvalidParameterError } from '@minddrop/utils';
import {
  setup,
  cleanup,
  emptyParagraphElement,
  linkElement1,
  paragraphElement1,
  unregisteredElement,
  blockEquationElement1,
  TestBlockEquationElementData,
  TestToDoElementData,
} from '../test-utils';
import { toPlainText } from '../toPlainText';
import { convertRichTextElement } from './convertRichTextElement';

const paragraph = { ...emptyParagraphElement, children: [{ text: 'e=mc^2' }] };

describe('convertRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the element type is not registered', () => {
    // Attempt to convert an element of an unregistered type,
    // should throw a `RTElementNotRegisteredError`.
    expect(() => convertRichTextElement(unregisteredElement, 'paragraph'));
  });

  it('throws if the convert to element type is not registered', () => {
    // Attempt to convert an element into an unregistered type,
    // should throw a `RTElementNotRegisteredError`.
    expect(() => convertRichTextElement(paragraphElement1, 'unregistered'));
  });

  it('throws if the element is not a block level element', () => {
    // Attempt to convert an inline level element, should
    // throw a `InvalidParameterError`.
    expect(() =>
      // @ts-ignore
      convertRichTextElement(linkElement1, 'paragraph'),
    ).toThrowError(InvalidParameterError);
  });

  it('throws if the convert to element type is not a block level element', () => {
    // Attempt to convert into an inline level element type,
    // should throw a `InvalidParameterError`.
    expect(() =>
      convertRichTextElement(paragraphElement1, 'link'),
    ).toThrowError(InvalidParameterError);
  });

  it('sets the new type on the element', () => {
    // Convert a 'paragraph' element into an 'block-equation' element
    const element = convertRichTextElement(paragraph, 'block-equation');

    // Element should have the new type
    expect(element.type).toBe('block-equation');
  });

  it("removes the original element's custom data", () => {
    // Convert from 'block-equation' element containing a `expression` field
    const element = convertRichTextElement<TestBlockEquationElementData>(
      blockEquationElement1,
      'paragraph',
    );

    // Element should no longer contain the `expression` field
    expect(element.expression).toBeUndefined();
  });

  it('preserves default element fields', () => {
    // Convert an element containing all default (including optional) rich
    // text block element fields.
    const element = convertRichTextElement(
      {
        ...paragraph,
        nestedElements: ['element-id'],
        deleted: true,
        deletedAt: new Date('01/01/2000'),
      },
      'block-equation',
    );

    // Should preserve the `id` field
    expect(element.id).toBe(paragraph.id);
    // Should preserve the `parents` field
    expect(element.parents).toEqual(paragraph.parents);
    // Should preserve the `nestedElements` field
    expect(element.nestedElements).toEqual(['element-id']);
    // Should preserve the `deleted` field
    expect(element.deleted).toBe(true);
    // Should preserve the `deletedAt` field
    expect(element.deletedAt).toEqual(new Date('01/01/2000'));
  });

  it('only sets optional default fields if present', () => {
    // Convert an element containing none of the default optional
    // rich text block element fields.
    const element = convertRichTextElement(paragraph, 'block-equation');

    // Should not contain any of the optional fields
    expect(
      doesNotContain(Object.keys(element), [
        'nestedElements',
        'files',
        'deleted',
        'deletedAt',
      ]),
    ).toBeTruthy();
  });

  it("adds the new element type's initial data", () => {
    // Convert a 'to-do' element which initializes a `done` property
    // in its `initializeData` property.
    const element = convertRichTextElement<TestToDoElementData>(
      paragraph,
      'to-do',
    );

    // Should have a `done` property
    expect(element.done).toBeDefined();
  });

  it("adds the element new element type's conversion data", () => {
    // Convert to a 'block-equation' element which initializes an
    // `expression` property in its `convertData` method.
    const element = convertRichTextElement<TestBlockEquationElementData>(
      paragraph,
      'block-equation',
    );

    // Should have an `expression` field set to the paragraph's
    // plain text content.
    expect(element.expression).toBe('e=mc^2');
  });

  it('removes `children` when converting to a void element type', () => {
    // Convert to a void 'block-equation' element type
    const element = convertRichTextElement<TestBlockEquationElementData>(
      paragraph,
      'block-equation',
    );

    // Should no longer have the `children` property
    expect(element.children).toBeUndefined();
  });

  it('adds `children` when converting from void to non-void types', () => {
    // Convert from a void 'block-equation' element type to a non-void
    // paragraph element type.
    const element = convertRichTextElement<TestBlockEquationElementData>(
      blockEquationElement1,
      'paragraph',
    );

    // Should add the `children` property containing the plain text
    // content of the void element.
    expect(element.children).toEqual([
      { text: toPlainText(blockEquationElement1) },
    ]);
  });

  it('preserves children when converting between two non-void elements', () => {
    // Convert from a 'paragraph' element to a 'heading-1' element
    const element = convertRichTextElement(paragraph, 'heading-1');

    // Should preserve children
    expect(element.children).toEqual(paragraph.children);
  });
});
