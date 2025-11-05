import { useCallback, useMemo, useState } from 'react';

/**
 * Definition for a form field.
 */
export interface FieldDefinition {
  /**
   * The field name prop.
   */
  name: string;

  /**
   * The field's default value.
   */
  defaultValue?: string;

  /**
   * Whether the field is required. If true, the field will be validated
   * to ensure it is not empty.
   */
  required?: boolean;

  /**
   * Whether to validate the field on blur. If true, the field will be
   * validated when it loses focus.
   */
  validateOnBlur?: boolean;

  /**
   * A synchronous validation function. Receives the field value and
   * should return an error message string if validation fails, or
   * undefined if validation passes.
   *
   * @param value - The field value.
   *
   * @returns An error message string if validation fails, or undefined
   * if validation passes.
   */
  validate?: (value: string) => string | undefined;

  /**
   * An asynchronous validation function. Receives the field value and
   * should return a Promise that resolves to an error message string
   * if validation fails, or undefined if validation passes.
   *
   * @param value - The field value.
   *
   * @returns A Promise that resolves to an error message string if
   * validation fails, or undefined if validation passes.
   */
  validateAsync?: (value: string) => Promise<string | undefined>;
}

/**
 * Props for individual form fields. Can be spread directly onto
 * input, textarea, or select elements.
 */
export interface FieldProps {
  /**
   * The field name prop.
   */
  name: string;

  /**
   * The field value.
   */
  value: string;

  /**
   * onChange event handler.
   */
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;

  /**
   * onBlur event handler. Applied when validateOnBlur is true.
   */
  onBlur?: () => void;

  /**
   * The field error message, if any.
   */
  error?: string;
}

export interface UseFormReturn {
  /**
   * A [field name]: value mapping of the current form values.
   */
  values: Record<string, string>;

  /**
   * A [field name]: error message mapping of the current form errors.
   */
  errors: Record<string, string | undefined>;

  /**
   * A [field name]: FieldProps mapping for spreading onto form fields.
   */
  fieldProps: Record<string, FieldProps>;

  /**
   * onChange handler generator for fields. Takes a field name and
   * returns an onChange event handler for that field.
   *
   * @param name - The field name.
   *
   * @returns An onChange event handler for the field.
   */
  setValue: (
    name: string,
  ) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;

  /**
   * Directly sets a field's value.
   *
   * @param name - The field name.
   * @param value - The new field value.
   */
  setFieldValue: (name: string, value: string) => void;

  /**
   * Validates a single field by name.
   *
   * @param name - The field name.
   *
   * @returns True if the field is valid, false otherwise.
   */
  validateField: (name: string) => boolean;

  /**
   * Asynchronously validates a single field by name. Runs both sync and async
   * validators.
   *
   * @param name - The field name.
   *
   * @returns A promise that resolves to true if the field is valid, false otherwise.
   */
  validateFieldAsync: (name: string) => Promise<boolean>;

  /**
   * Validates all fields in the form.
   *
   * @returns True if all fields are valid, false otherwise.
   */
  validateAll: () => boolean;

  /**
   * Asynchronously validates all fields in the form. Runs both sync and async
   * validators.
   *
   * @returns A promise that resolves to true if all fields are valid, false otherwise.
   */
  validateAllAsync: () => Promise<boolean>;

  /**
   * Resets the form to its initial values and clears all errors.
   */
  reset: () => void;
}

export function useForm(fieldDefinitions: FieldDefinition[]): UseFormReturn {
  // Initialize values from field definitions
  const initialValues = fieldDefinitions.reduce(
    (acc, field) => {
      acc[field.name] = field.defaultValue || '';

      return acc;
    },
    {} as Record<string, string>,
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Create a map for quick field lookup
  const fieldMap = fieldDefinitions.reduce(
    (acc, field) => {
      acc[field.name] = field;

      return acc;
    },
    {} as Record<string, FieldDefinition>,
  );

  // Run basic validation (required and sync validate)
  const runBasicValidation = useCallback(
    (field: FieldDefinition, value: string): string | undefined => {
      let error: string | undefined;

      // Run custom validation if provided
      if (field.validate) {
        error = field.validate(value);
      }

      // Check required
      if (!error && field.required && !value.trim()) {
        // TODO: Use i18n for error message
        error = 'Required';
      }

      return error;
    },
    [],
  );

  // Validate a single field
  const validateField = useCallback(
    (name: string): boolean => {
      const field = fieldMap[name];

      if (!field) {
        return true;
      }

      const value = values[name] || '';
      const error = runBasicValidation(field, value);

      setErrors((prev) => ({ ...prev, [name]: error }));

      return !error;
    },
    [fieldMap, values, runBasicValidation],
  );

  // Validate a single field with async validation
  const validateFieldAsync = useCallback(
    async (name: string): Promise<boolean> => {
      const field = fieldMap[name];

      if (!field) {
        return true;
      }

      const value = values[name] || '';
      let error = runBasicValidation(field, value);

      // Run async validation if provided and no sync errors
      if (!error && field.validateAsync) {
        error = await field.validateAsync(value);
      }

      setErrors((prev) => ({ ...prev, [name]: error }));

      return !error;
    },
    [fieldMap, values, runBasicValidation],
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    fieldDefinitions.forEach((field) => {
      const value = values[field.name] || '';
      const error = runBasicValidation(field, value);

      if (error) {
        isValid = false;
      }

      newErrors[field.name] = error;
    });

    setErrors(newErrors);

    return isValid;
  }, [fieldDefinitions, values, runBasicValidation]);

  // Validate all fields with async validation
  const validateAllAsync = useCallback(async (): Promise<boolean> => {
    const newErrors: Record<string, string | undefined> = {};
    let isValid = true;

    for (const field of fieldDefinitions) {
      const value = values[field.name] || '';
      let error = runBasicValidation(field, value);

      // Run async validation if provided and no sync errors
      if (!error && field.validateAsync) {
        error = await field.validateAsync(value);
      }

      if (error) {
        isValid = false;
      }

      newErrors[field.name] = error;
    }

    setErrors(newErrors);

    return isValid;
  }, [fieldDefinitions, values, runBasicValidation]);

  // Set value handler for onChange events
  const setValue = useCallback(
    (name: string) => {
      return (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const newValue = e.target.value;
        setValues((prev) => ({ ...prev, [name]: newValue }));

        // Clear error when user starts typing
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
      };
    },
    [errors],
  );

  // Direct value setter (useful for programmatic updates)
  const setFieldValue = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Generate fieldProps for each field
  const fieldProps = useMemo(() => {
    const props: Record<string, FieldProps> = {};

    fieldDefinitions.forEach((field) => {
      const fieldProp: FieldProps = {
        name: field.name,
        value: values[field.name] || '',
        onChange: setValue(field.name),
        error: errors[field.name],
      };

      if (field.validateOnBlur) {
        fieldProp.onBlur = field.validateAsync
          ? () => validateFieldAsync(field.name)
          : () => validateField(field.name);
      }

      props[field.name] = fieldProp;
    });

    return props;
  }, [
    fieldDefinitions,
    values,
    setValue,
    errors,
    validateField,
    validateFieldAsync,
  ]);

  return {
    values,
    errors,
    fieldProps,
    setValue,
    setFieldValue,
    validateField,
    validateFieldAsync,
    validateAll,
    validateAllAsync,
    reset,
  };
}
