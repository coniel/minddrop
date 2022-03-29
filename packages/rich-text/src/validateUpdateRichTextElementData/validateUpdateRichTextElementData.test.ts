import { RichTextElementValidationError } from '../errors';
import { validateUpdateRichTextElementData } from './validateUpdateRichTextElementData';

describe('validateUpdateRichTextElementData', () => {
  it('throws if the data contains `id`', () => {
    // Validate data which contains a `id` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        id: 'new-id',
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `type`', () => {
    // Validate data which contains a `type` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        type: 'new-type',
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `parents`', () => {
    // Validate data which contains a `parents` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        parents: [{ type: 'rich-text-document', id: 'document-id' }],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `files`', () => {
    // Validate data which contains a `files` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        files: ['file-id'],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `nestedElements`', () => {
    // Validate data which contains a `nestedElements` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        nestedElements: ['element-id'],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `deleted`', () => {
    // Validate data which contains a `deleted` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        deleted: true,
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('throws if the data contains `deletedAt`', () => {
    // Validate data which contains a `deletedAt` field,
    // should throw a `RichTextElementValidationError`.
    expect(() =>
      validateUpdateRichTextElementData({
        // @ts-ignore
        deletedAt: new Date(),
      }),
    ).toThrowError(RichTextElementValidationError);
  });
});
