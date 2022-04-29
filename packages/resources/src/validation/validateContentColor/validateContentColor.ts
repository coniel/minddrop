import { ContentColor, ContentColors } from '@minddrop/core';
import {
  ValidatorOptionsSchema,
  ValidationError,
  validateValue,
} from '@minddrop/utils';
import { ContentColorValidator } from '../../types';

export const ContentColorValidatorOptionsSchema: ValidatorOptionsSchema<ContentColorValidator> =
  {
    allowedColors: {
      type: 'set',
      options: ContentColors,
    },
  };

/**
 * Validates a content-color.
 *
 * Throws a `ValidationError` if the value is not a
 * content-color or it is not listed in `allowedColors`.
 *
 * @param validator The content-color validator.
 * @param value The value to validate.
 */
export function validateContentColor(
  validator: ContentColorValidator,
  value: unknown,
): void {
  // Ensure that the validator is valid
  validateValue(
    {
      type: 'validator',
      allowedTypes: ['content-color'],
      optionsSchemas: { 'content-color': ContentColorValidatorOptionsSchema },
    },
    validator,
  );

  // The allowed content colors. Either the ones specified in
  // the validator or all content-colors.
  const allowedColors = validator.allowedColors || ContentColors;

  // Ensure that the value is a valid content-color appearing
  // in the list of allowed colors.
  if (!allowedColors.includes(value as ContentColor)) {
    throw new ValidationError(
      `invalid content-color value ${JSON.stringify(
        value,
      )}, must be one of ${allowedColors
        .map((option) => JSON.stringify(option))
        .join(',')}`,
    );
  }
}
