import { Field } from '@base-ui/react/field';
import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';

export interface FieldDescriptionProps extends Field.Description.Props {
  /*
   * i18n key for the description text. Falls back to children if not provided.
   */
  description?: string;

  /*
   * Description content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * Size of the description text.
   * @default 'sm'
   */
  size?: TextSize;

  /*
   * Color of the description text.
   * @default 'muted'
   */
  color?: TextColor;
}

export const FieldDescription: React.FC<FieldDescriptionProps> = ({
  description,
  children,
  size = 'sm',
  color = 'muted',
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <Field.Description {...other}>
      <Text size={size} color={color}>
        {description ? t(description) : children}
      </Text>
    </Field.Description>
  );
};
