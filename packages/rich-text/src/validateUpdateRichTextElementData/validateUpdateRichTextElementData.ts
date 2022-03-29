import { RichTextElementValidationError } from '../errors';
import { UpdateRichTextElementData } from '../types';

/**
 * Validates a rich text element update data object, ensuring
 * that it does not contain any fields which should not be
 * updated directly.
 *
 * @param data The data object to validate.
 */
export function validateUpdateRichTextElementData(
  data: UpdateRichTextElementData,
): void {
  // Ensure that the `id` field is not set
  if ('id' in data) {
    throw new RichTextElementValidationError(
      'updating the `id` property is forbidden',
    );
  }

  // Ensure that the `type` field is not set
  if ('type' in data) {
    throw new RichTextElementValidationError(
      'updating the `type` property directly is forbidden, please use the `RichTextElements.convert` method instead',
    );
  }

  // Ensure that the `parents` field is not set
  if ('parents' in data) {
    throw new RichTextElementValidationError(
      'updating the `parents` property directly is forbidden, please use the `RichTextElements.[add/remove/replace]Parents` method instead',
    );
  }

  // Ensure that the `files` field is not set
  if ('files' in data) {
    throw new RichTextElementValidationError(
      'updating the `files` property directly is forbidden, please use the `RichTextElements.[add/remove/replace]Files` method instead',
    );
  }

  // Ensure that the `nestedElements` field is not set
  if ('nestedElements' in data) {
    throw new RichTextElementValidationError(
      'updating the `nestedElements` property directly is forbidden, please use the `RichTextElements.[nest/unnest]` method instead',
    );
  }

  // Ensure that the `deleted` field is not set
  if ('deleted' in data) {
    throw new RichTextElementValidationError(
      'updating the `deleted` property directly is forbidden, please use the `RichTextElements.[delete/restore]` method instead',
    );
  }

  // Ensure that the `deletedAt` field is not set
  if ('deletedAt' in data) {
    throw new RichTextElementValidationError(
      'updating the `deletedAt` property directly is forbidden, please use the `RichTextElements.[delete/restore]` method instead',
    );
  }
}
