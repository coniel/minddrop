import { useState } from 'react';
import {
  TranslationKey,
  TranslationValues,
  useTranslation,
} from '@minddrop/i18n';

/**
 * The error a field value is rejected with: an i18n key, an i18n key
 * with its interpolation values, or a plain string.
 */
export type FieldValidationError =
  | TranslationKey
  | { key: TranslationKey; values: TranslationValues }
  | { string: string };

/**
 * Checks a field value. Returns the error to reject it with, or false
 * to accept it.
 */
export type FieldValidate<TValue> = (
  value: TValue,
) => FieldValidationError | false;

export interface FieldValidation<TValue> {
  /**
   * The text of the error the last validated value was rejected
   * with. Undefined when there is none.
   */
  errorText: string | undefined;

  /**
   * Validates a value, showing the error it is rejected with or
   * clearing a shown one. Returns whether the value is accepted.
   */
  validate: (value: TValue) => boolean;

  /**
   * Clears the shown error.
   */
  clearError: () => void;
}

/**
 * Keeps the error a field's validation rejects a value with.
 *
 * @param validate - Checks a value. Omit to accept every value.
 * @returns The error text and the functions validating a value and clearing the error.
 */
export function useFieldValidation<TValue>(
  validate?: FieldValidate<TValue>,
): FieldValidation<TValue> {
  // The error the last validated value was rejected with
  const [error, setError] = useState<FieldValidationError | null>(null);
  const { t } = useTranslation();

  // Resolve the error into its text
  const errorText = resolveErrorText();

  // Validate a value, showing the error it is rejected with
  function validateValue(value: TValue): boolean {
    // Check the value against the field's validation
    const result = validate ? validate(value) : false;

    // Check if the value is rejected. If so, show the error.
    if (result !== false) {
      setError(result);

      return false;
    }

    // Clear the error of a previous rejected value
    setError(null);

    return true;
  }

  // Clear the shown error
  function clearError() {
    setError(null);
  }

  // Resolve the error into the text shown for it
  function resolveErrorText(): string | undefined {
    if (!error) {
      return undefined;
    }

    // Translate an i18n key
    if (typeof error === 'string') {
      return t(error);
    }

    // Translate an i18n key with its values
    if ('key' in error) {
      return t(error.key, error.values);
    }

    // Use a plain string as is
    return error.string;
  }

  return { errorText, validate: validateValue, clearError };
}
