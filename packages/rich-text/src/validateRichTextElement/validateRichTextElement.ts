import { ParentReferences } from '@minddrop/core';
import { Files } from '@minddrop/files';
import {
  RichTextElementNotFoundError,
  RichTextElementTypeNotRegisteredError,
  RichTextElementValidationError,
} from '../errors';
import { getRichTextElement } from '../getRichTextElement';
import { getRichTextElementConfig } from '../getRichTextElementConfig';
import { RichTextElement, RichTextElementConfig } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Validates a rich text element, checking that:
 * - The element type is registered
 * - The element contains all required fileds
 * - The element does not contain forbidden fields
 * - If the element is non-void, it has valid children
 * - If the element contains files, the files exist
 * - If the element has parent documents, the documents exist
 * - If the element has parent elements, the elements exist
 *
 * Throws one of the following errors if validation fails:
 * - `RichTextElementTypeNotRegistered` error if the element typeis
 *   not registered.
 * - `ParentReferenceValidationError` if any of the parent references
 *   are invalid.
 * - `RichTextElementValidationError` if any of the other checks fail.
 *
 * @param element The rich text element to validate.
 */
export function validateRichTextElement(element: RichTextElement): void {
  // Check that the element has an `id` property
  if (!element.id) {
    throw new RichTextElementValidationError("property 'id' is required");
  }

  // Check that the `id` property is a string
  if (typeof element.id !== 'string') {
    throw new RichTextElementValidationError("property 'id' must be a string");
  }

  // Check the the element has a `type` property
  if (!element.type) {
    throw new RichTextElementValidationError("property 'type' is required");
  }

  // Check that the `type` property is a string
  if (typeof element.type !== 'string') {
    throw new RichTextElementValidationError(
      "property 'type' must be a string",
    );
  }

  // Check that the element has a `parents` property
  if (!element.parents) {
    throw new RichTextElementValidationError(
      'property `parents` is required (set to an empty array if element has no parents)',
    );
  }

  // Check that the `parents` property is an array
  if (!Array.isArray(element.parents)) {
    throw new RichTextElementValidationError(
      'property `parents` must be an array of `ParentReference` objects (set to an empty array if element has no parents)',
    );
  }

  // Ensure that all parents are valid `ParentReference` objects
  ParentReferences.validate(element.parents);

  // Get the element's configuration object
  const config = getRichTextElementConfig(element.type);

  // Validate the  `children` property
  if (!config.void) {
    // Ensure that a non-void element has a `children` value
    if (!element.children) {
      throw new RichTextElementValidationError(
        "property 'children' is required on non-void elements",
      );
    }

    // Ensure that `children` contains at least 1 child
    if (element.children.length === 0) {
      throw new RichTextElementValidationError(
        'element must contain at least 1 child `RichTextNode`',
      );
    }
  } else if (element.children) {
    // Ensure that a void element does not have `children`
    throw new RichTextElementValidationError(
      'property `children` is forbidden on void elements',
    );
  }

  // If the element has a parent documents, ensure that they exist
  const parentDocumentIds = element.parents
    .filter((parent) => parent.type === 'rich-text-document')
    .map((parent) => parent.id);

  if (parentDocumentIds.length) {
    parentDocumentIds.forEach((id) => {
      if (!useRichTextStore.getState().documents[id]) {
        throw new RichTextElementValidationError(
          `parent rich text document "${id}" does not exist`,
        );
      }
    });
  }

  // If the element has parent elements, ensure that they exist
  const parentElementIds = element.parents
    .filter((parent) => parent.type === 'rich-text-element')
    .map((parent) => parent.id);

  if (parentElementIds.length) {
    parentElementIds.forEach((id) => {
      if (!useRichTextStore.getState().elements[id]) {
        throw new RichTextElementValidationError(
          `parent rich text element "${id}" does not exist`,
        );
      }
    });
  }

  // If the element contains files, ensure that they exist
  if (element.files) {
    element.files.forEach((id) => {
      try {
        // Check that the file exists
        Files.get(id);
      } catch {
        // If an error was thrown, it means the the attached file reference
        // does not exist. Throw a `RichTextElementValidationError`
        // explaining the issue.
        throw new RichTextElementValidationError(
          `attached file reference ${id} does not exist`,
        );
      }
    });
  }

  // Validate the `nestedElements` property
  if ('nestedElements' in element) {
    // Only block level elements are permitted to have nested elements
    if (config.level === 'inline') {
      throw new RichTextElementValidationError(
        'property `nestedElements` is forbidden on inline elements',
      );
    }

    // Ensure that all nested elements exist, are 'block' level elements,
    // and that the element type is registered.
    element.nestedElements.forEach((id) => {
      let nestedElement: RichTextElement;
      let nestedElementConfig: RichTextElementConfig;

      try {
        // Get the nested element
        nestedElement = getRichTextElement(id);

        // Get the nested element's configuration object
        nestedElementConfig = getRichTextElementConfig(nestedElement.type);
      } catch (error) {
        if (error instanceof RichTextElementNotFoundError) {
          // If a `RichTextElementValidationError` was encountered it means
          // the the nested element does not exist. Throw a
          // `RichTextElementValidationError` explaining the issue.
          throw new RichTextElementValidationError(
            `nested rich text element "${id}" does not exist`,
          );
        } else if (error instanceof RichTextElementTypeNotRegisteredError) {
          // If a `RichTextElementTypeNotRegisteredError` was encountered,
          // it means that a nested element's type is not registered. Throw
          // a `RichTextElementValidationError` explaining the issue.
          throw new RichTextElementValidationError(
            `nested element type '${nestedElement.type}' is not registered`,
          );
        }
      }

      if (nestedElementConfig.level !== 'block') {
        // Only block level elements are permitted in `nestedElements`
        throw new RichTextElementValidationError(
          'only block level elements are permitted in `nestedElements`',
        );
      }
    });
  }

  // Validate the deleted state
  if ('deleted' in element) {
    // Deleted at must only be set to `true`
    if (element.deleted !== true) {
      throw new RichTextElementValidationError(
        'property `deleted` may only be set to `true`, remove the property if the element is no longer deleted',
      );
    }

    // A deleted element must have a `deletedAt` timestamp
    if (!(element.deletedAt instanceof Date)) {
      throw new RichTextElementValidationError(
        '`deletedAt` must be set to a timestamp when `deleted` is true',
      );
    }
  }

  // `deletedAt` should not be set unless `deleted` is true
  if (element.deletedAt && !element.deleted) {
    throw new RichTextElementValidationError(
      'property `deletedAt` must only be set when property `deleted` is true',
    );
  }
}
