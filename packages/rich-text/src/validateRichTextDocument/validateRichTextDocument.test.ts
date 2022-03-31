import { ParentReferenceValidationError } from '@minddrop/core';
import {
  RichTextDocumentValidationError,
  RichTextElementNotFoundError,
  RichTextElementTypeNotRegisteredError,
} from '../errors';
import {
  setup,
  cleanup,
  richTextDocument1,
  inlineEquationElement1,
  core,
  headingElement1,
} from '../test-utils';
import { unregisterRichTextElementType } from '../unregisterRichTextElementType';
import { validateRichTextDocument } from './validateRichTextDocument';

describe('validateRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does something useful', () => {
    //
  });

  it('throws if the document has no `id`', () => {
    // Validate a document without an 'id', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      validateRichTextDocument({ ...richTextDocument1, id: '' }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if the `id` property is not a string', () => {
    // Validate a document with an invalid 'id', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({ ...richTextDocument1, id: 1234 }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if the document has no `revision`', () => {
    // Validate a document without a 'revision', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      validateRichTextDocument({ ...richTextDocument1, revision: '' }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if the `revision` property is not a string', () => {
    // Validate a document with an invalid 'revision', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({ ...richTextDocument1, revision: 1234 }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if the document has no `createdAt`', () => {
    // Validate a document without a 'createdAt', should throw a
    // `RichTextDocumentValidationError`.
    const document = { ...richTextDocument1 };
    delete document.createdAt;
    expect(() => validateRichTextDocument(document)).toThrowError(
      RichTextDocumentValidationError,
    );
  });

  it('throws if the `createdAt` property is not a date', () => {
    // Validate a document with an invalid 'createdAt', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({ ...richTextDocument1, createdAt: 1234 }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if the document has no `updatedAt`', () => {
    // Validate a document without a 'updatedAt', should throw a
    // `RichTextDocumentValidationError`.
    const document = { ...richTextDocument1 };
    delete document.updatedAt;
    expect(() => validateRichTextDocument(document)).toThrowError(
      RichTextDocumentValidationError,
    );
  });

  it('throws if the `updatedAt` property is not a date', () => {
    // Validate a document with an invalid 'updatedAt', should throw a
    // `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({ ...richTextDocument1, updatedAt: 1234 }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if `parents` field is not an array', () => {
    // Validate a document with no `parents` property, should
    // throw a `RichTextDocumentValidationError`.
    const document = { ...richTextDocument1 };
    delete document.parents;
    expect(() => validateRichTextDocument(document)).toThrowError(
      RichTextDocumentValidationError,
    );

    // Validate a document with an invalid `parents` property,
    // should throw a `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({ ...richTextDocument1, parents: 'parent-id' }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('throws if `parents` contains an invalid parent', () => {
    // Validate a document with no `parents` property, should
    // throw a `RichTextDocumentValidationError`.
    const document = { ...richTextDocument1 };
    delete document.parents;
    expect(() => validateRichTextDocument(document)).toThrowError(
      RichTextDocumentValidationError,
    );

    // Validate a document with an invalid parent in its `parents`
    // property, should throw a `RichTextDocumentValidationError`.
    expect(() =>
      // @ts-ignore
      validateRichTextDocument({
        ...richTextDocument1,
        // @ts-ignore
        parents: [{ id: 'parent-id' }],
      }),
    ).toThrowError(ParentReferenceValidationError);
  });

  describe('deleted document', () => {
    it('throws if the document is deleted but does not have a `deletedAt` timestamp', () => {
      // Validate a deleted document which does not have a deletedAt
      // value. Should throw a `RichTextDocumentValidationError`.
      expect(() =>
        validateRichTextDocument({ ...richTextDocument1, deleted: true }),
      ).toThrowError(RichTextDocumentValidationError);
    });

    it('throws is `deletedAt` is not a date', () => {
      // Validate a deleted document which has an invalid `deleteAt`
      // value. Should throw a `RichTextDocumentValidationError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          deleted: true,
          // @ts-ignore
          deletedAt: 'foo',
        }),
      ).toThrowError(RichTextDocumentValidationError);
    });

    it('throws if `deletedAt` is set but `deleted` is not', () => {
      // Validate a non-deleted document which has a `deletedAt` value.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          deletedAt: new Date(),
        }),
      ).toThrowError(RichTextDocumentValidationError);
    });

    it('throws if `deleted` is set to anything but `true`', () => {
      // Validate an document in which `deleted` is set to `false`.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          // @ts-ignore
          deleted: false,
          deletedAt: new Date(),
        }),
      ).toThrowError(RichTextDocumentValidationError);

      // Validate an document in which `deleted` is set to a string.
      // Should throw a `RichTextELementValidationError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          // @ts-ignore
          deleted: 'true',
          deletedAt: new Date(),
        }),
      ).toThrowError(RichTextDocumentValidationError);
    });
  });

  describe('children', () => {
    it('throws if a child does not exist', () => {
      // Validate a document containing a child which does not
      // exist. Should throw a `RichTextElementNotFoundError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          children: ['missing'],
        }),
      ).toThrowError(RichTextElementNotFoundError);
    });

    it('throws if a child element type is not reigstered', () => {
      // Unregister the 'heading-1' element type
      unregisterRichTextElementType(core, headingElement1.type);

      // Validate a document containing a 'heading-1' element as a
      // child. Should throw a `RichTextElementTypeNotRegisteredError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          children: [headingElement1.id],
        }),
      ).toThrowError(RichTextElementTypeNotRegisteredError);
    });

    it('throws if a child is not a block level element', () => {
      // Validate a document containing an inline level element as
      // a child. Should throw a `RichTextDocumentValidationError`.
      expect(() =>
        validateRichTextDocument({
          ...richTextDocument1,
          children: [inlineEquationElement1.id],
        }),
      ).toThrowError(RichTextDocumentValidationError);
    });
  });
});
