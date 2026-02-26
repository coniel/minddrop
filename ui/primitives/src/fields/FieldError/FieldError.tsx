import { Field } from '@base-ui/react/field';
import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';

export interface FieldErrorProps extends Field.Error.Props {
  /*
   * i18n key for the error text. Falls back to children if not provided.
   */
  error?: string;

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
  children,
  size = 'sm',
  color = 'danger',
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <Field.Error match={true} {...other}>
      <Text size={size} color={color}>
        {error ? t(error) : children}
      </Text>
    </Field.Error>
  );
};
