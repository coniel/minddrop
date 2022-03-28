import {
  RichTextElementTypeNotRegisteredError,
  RichTextElementValidationError,
} from '../errors';
import {
  setup,
  cleanup,
  headingElement1,
  linkElement1,
  inlineEquationElement1,
  blockEquationElement1,
  core,
} from '../test-utils';
import { unregisterRichTextElementType } from '../unregisterRichTextElementType';
import { validateRichTextElement } from './validateRichTextElement';

describe('validateRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does not throw an error given a valid element', () => {
    // Validate a valid block element
    expect(() => validateRichTextElement(headingElement1)).not.toThrow();
    // Validate a valid inline element
    expect(() => validateRichTextElement(linkElement1)).not.toThrow();
    // Validate a valid void block element
    expect(() => validateRichTextElement(blockEquationElement1)).not.toThrow();
    // Validate a valid void inline element
    expect(() => validateRichTextElement(inlineEquationElement1)).not.toThrow();
    // Validate a valid deleted element
    expect(() =>
      validateRichTextElement({
        ...headingElement1,
        deleted: true,
        deletedAt: new Date(),
      }),
    ).not.toThrow();
    // Validate an element with a valid parent element
    expect(() =>
      validateRichTextElement({
        ...blockEquationElement1,
        parents: [{ type: 'rich-text-element', id: headingElement1.id }],
      }),
    ).not.toThrow();
  });

  it('throws if the element has no `id`', () => {
    // Validate an element without an 'id', should throw a
    // `RichTextElementValidationError`.
    expect(() =>
      validateRichTextElement({ ...headingElement1, id: '' }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the `id` property is not a string', () => {
    // Validate an element with an invalid 'id', should throw a
    // `RichTextElementValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextElement({ ...headingElement1, id: 1234 }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the element has no `type`', () => {
    // Validate an element without a 'type', should throw a
    // `RichTextElementValidationError`.
    expect(() =>
      validateRichTextElement({ ...headingElement1, type: '' }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the `type` property is not a string', () => {
    // Validate an element with an invalid 'type', should throw a
    // `RichTextElementValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextElement({ ...headingElement1, type: 1234 }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the element type is not registered', () => {
    // Validate an element of a type that is not registered, should
    // throw a `RichTextElementTypeNotRegisteredError`.
    expect(() =>
      validateRichTextElement({
        ...headingElement1,
        type: 'unregistered-type',
      }),
    ).toThrowError(RichTextElementTypeNotRegisteredError);
  });

  it('throws if a parent rich text document does not exist', () => {
    // Validate an element with a parent document which does not
    // exist, should throw a `RichTextElementValidationError`.
    expect(() =>
      validateRichTextElement({
        ...headingElement1,
        parents: [{ type: 'rich-text-document', id: 'missing-document' }],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if `parents` field is not an array', () => {
    // Validate an element with no `parents` property, should
    // throw a `RichTextElementValidationError`.
    const element = { ...headingElement1 };
    delete element.parents;
    expect(() => validateRichTextElement(element)).toThrowError(
      RichTextElementValidationError,
    );

    // Validate an element with an invalid `parents` property,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextElement({ ...headingElement1, parents: 'parent-id' }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if a parent rich text element does not exist', () => {
    // Validate an element with a parent element which does not
    // exist, should throw a `RichTextElementValidationError`.
    expect(() =>
      validateRichTextElement({
        ...headingElement1,
        parents: [{ type: 'rich-text-element', id: 'missing-element' }],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if an attached file does not exist', () => {
    // Validate an element with a file which does not exist,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateRichTextElement({ ...headingElement1, files: ['missing-file'] }),
    ).toThrowError(RichTextElementValidationError);
  });

  describe('nestedElements', () => {
    it('throws if an inline elements defines the `nestedElements` field', () => {
      // Validate an inline element containing a `nestedElements` field,
      // should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({ ...linkElement1, nestedElements: [] }),
      );
    });

    it('throws if a nested element does not exist', () => {
      // Validat an element with a nested element which does not
      // exist, should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          nestedElements: ['missing-element'],
        }),
      ).toThrowError(RichTextElementValidationError);
    });

    it('throws if a nested element type is not registered', () => {
      // Unregister the 'block-equation' type
      unregisterRichTextElementType(core, blockEquationElement1.type);

      // Validate an element with a 'block-equation' as a nested
      // element, should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          nestedElements: [blockEquationElement1.id],
        }),
      ).toThrowError(RichTextElementValidationError);
    });

    it('throws if a nested element is not a block level element', () => {
      // Validate an element with an inline level element listed in
      // its nested elements, should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          nestedElements: [inlineEquationElement1.id],
        }),
      ).toThrowError(RichTextElementValidationError);
    });
  });

  describe('non-void element', () => {
    it('throws if a non-void element has no `children`', () => {
      // Validate a non-void element with no children, should throw a
      // `RichTextElementValidationError`.
      const element = { ...headingElement1 };
      delete element.children;
      expect(() => validateRichTextElement(element)).toThrowError(
        RichTextElementValidationError,
      );
    });

    it('throws if `children` is empty', () => {
      // Validate an element with an empty `children` field, should
      // throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({ ...headingElement1, children: [] }),
      ).toThrowError(RichTextElementValidationError);
    });
  });

  describe('void element', () => {
    it('throws if `children` is present', () => {
      // Validate a void element with a `children` field, should
      // throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...blockEquationElement1,
          children: [{ text: '' }],
        }),
      ).toThrowError(RichTextElementValidationError);
    });
  });

  describe('deleted element', () => {
    it('throws if the element is deleted but does not have a `deletedAt` timestamp', () => {
      // Validate a deleted element which does not have a deletedAt
      // value. Should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({ ...headingElement1, deleted: true }),
      ).toThrowError(RichTextElementValidationError);
    });

    it('throws is `deletedAt` is not a date', () => {
      // Validate a deleted element which has an invalid `deleteAt`
      // value. Should throw a `RichTextElementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          deleted: true,
          // @ts-ignore
          deletedAt: 'foo',
        }),
      ).toThrowError(RichTextElementValidationError);
    });

    it('throws if `deletedAt` is set but `deleted` is not', () => {
      // Validate a non-deleted element which has a `deletedAt` value.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextElement({ ...headingElement1, deletedAt: new Date() }),
      ).toThrowError(RichTextElementValidationError);
    });

    it('throws if `deleted` is set to anything but `true`', () => {
      // Validate an element in which `deleted` is set to `false`.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          // @ts-ignore
          deleted: false,
          deletedAt: new Date(),
        }),
      ).toThrowError(RichTextElementValidationError);

      // Validate an element in which `deleted` is set to a string.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextElement({
          ...headingElement1,
          // @ts-ignore
          deleted: 'true',
          deletedAt: new Date(),
        }),
      ).toThrowError(RichTextElementValidationError);
    });
  });
});
