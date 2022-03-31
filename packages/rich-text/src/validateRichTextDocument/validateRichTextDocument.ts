import { ParentReferences } from '@minddrop/core';
import { RichTextDocumentValidationError } from '../errors';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { getRichTextElements } from '../getRichTextElements';
import { RichTextDocument } from '../types';

/**
 * Does something useful.
 */
export function validateRichTextDocument(document: RichTextDocument): void {
  // Check that the document has an `id` property
  if (!document.id) {
    throw new RichTextDocumentValidationError("property 'id' is required");
  }

  // Check that the `id` property is a string
  if (typeof document.id !== 'string') {
    throw new RichTextDocumentValidationError("property 'id' must be a string");
  }

  // Check that the document has an `revision` property
  if (!document.revision) {
    throw new RichTextDocumentValidationError(
      "property 'revision' is required",
    );
  }

  // Check that the `revision` property is a string
  if (typeof document.revision !== 'string') {
    throw new RichTextDocumentValidationError(
      "property 'revision' must be a string",
    );
  }

  // Check that the document has a `createdAt` property
  if (!document.createdAt) {
    throw new RichTextDocumentValidationError(
      "property 'createdAt' is required",
    );
  }

  // Check that the `createdAt` property is a date
  if (!(document.createdAt instanceof Date)) {
    throw new RichTextDocumentValidationError(
      "property 'createdAt' must be a Date",
    );
  }

  // Check that the document has a `updatedAt` property
  if (!document.updatedAt) {
    throw new RichTextDocumentValidationError(
      "property 'updatedAt' is required",
    );
  }

  // Check that the `updatedAt` property is a date
  if (!(document.updatedAt instanceof Date)) {
    throw new RichTextDocumentValidationError(
      "property 'updatedAt' must be a Date",
    );
  }

  // Check that the document has a `parents` property
  if (!document.parents) {
    throw new RichTextDocumentValidationError(
      'property `parents` is required (set to an empty array if document has no parents)',
    );
  }

  // Check that the `parents` property is an array
  if (!Array.isArray(document.parents)) {
    throw new RichTextDocumentValidationError(
      'property `parents` must be an array of `ParentReference` objects (set to an empty array if document has no parents)',
    );
  }

  // Check that all parents are valid `ParentReference` objects
  ParentReferences.validate(document.parents);

  // Validate the deleted state
  if ('deleted' in document) {
    // Deleted at must only be set to `true`
    if (document.deleted !== true) {
      throw new RichTextDocumentValidationError(
        'property `deleted` may only be set to `true`, remove the property if the document is no longer deleted',
      );
    }

    // A deleted document must have a `deletedAt` timestamp
    if (!(document.deletedAt instanceof Date)) {
      throw new RichTextDocumentValidationError(
        '`deletedAt` must be set to a timestamp when `deleted` is true',
      );
    }
  }

  // `deletedAt` should not be set unless `deleted` is true
  if (document.deletedAt && !document.deleted) {
    throw new RichTextDocumentValidationError(
      'property `deletedAt` must only be set when property `deleted` is true',
    );
  }

  // Ensure that all of the document's children exist
  const children = getRichTextElements(document.children);

  // Ensure that all children are of registered types and
  // are block level elements.
  Object.values(children).forEach((child) => {
    // Get the child element's configuration object
    const config = getRichTextElementConfig(child.type);

    // Check that the element is a block level element.
    if (config.level !== 'block') {
      throw new RichTextDocumentValidationError(
        'only block level elements are permitted as children',
      );
    }
  });
}
