import { Field } from '@base-ui/react/field';
import React, { useMemo } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';

export interface FieldErrorProps extends Field.Error.Props {
  /*
   * i18n key for the error text. Falls back to children if not provided.
   */
  error?: TranslationKey;

  /*
   * Plain string error rendered as-is without i18n translation.
   * Takes priority over `error`.
   */
  stringError?: string;

  /*
   * Error content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * Size of the error text.
   * @default 'sm'
   */
  size?: TextSize;

  /*
   * Color of the error text.
   * @default 'danger'
   */
  color?: TextColor;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  error,
  stringError,
  children,
  size = 'sm',
  color = 'danger',
  ...other
}) => {
  const { t } = useTranslation();

  // Resolve the error text from the available sources
  const resolvedError = useMemo(() => {
    if (stringError) {
      return stringError;
    }

    if (error) {
      return t(error);
    }

    return children;
  }, [stringError, error, children, t]);

  return (
    <Field.Error match={true} {...other}>
      <Text size={size} color={color}>
        {resolvedError}
      </Text>
    </Field.Error>
  );
};
