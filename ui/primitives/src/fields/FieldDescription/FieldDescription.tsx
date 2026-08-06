import { Field } from '@base-ui/react/field';
import React, { useMemo } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';

export interface FieldDescriptionProps extends Field.Description.Props {
  /*
   * i18n key for the description text. Falls back to children if not provided.
   */
  description?: TranslationKey;

  /*
   * Plain string description rendered as-is without i18n translation.
   * Takes priority over `description`.
   */
  stringDescription?: string;

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
  stringDescription,
  children,
  size = 'sm',
  color = 'muted',
  ...other
}) => {
  const { t } = useTranslation();

  // Resolve the description from the available sources
  const resolvedDescription = useMemo(() => {
    if (stringDescription) {
      return stringDescription;
    }

    if (description) {
      return t(description);
    }

    return children;
  }, [stringDescription, description, children, t]);

  return (
    <Field.Description {...other}>
      <Text size={size} color={color}>
        {resolvedDescription}
      </Text>
    </Field.Description>
  );
};
