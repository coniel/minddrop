import { Field } from '@base-ui/react/field';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { TextColor, TextSize } from '../../Text';
import { propsToClass } from '../../utils';
import { InputLabel } from '../InputLabel';

export interface FieldLabelProps extends Field.Label.Props {
  /*
   * i18n key for the label text. Falls back to children if not provided.
   */
  label?: TranslationKey;

  /*
   * Label content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * Size of the label text.
   * @default 'sm'
   */
  size?: TextSize;

  /*
   * Color of the label text.
   * @default 'muted'
   */
  color?: TextColor;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  children,
  className,
  size = 'sm',
  color = 'muted',
  ...other
}) => {
  return (
    <Field.Label className={propsToClass('field-label', { className })} {...other}>
      <InputLabel size={size} color={color} label={label}>
        {children}
      </InputLabel>
    </Field.Label>
  );
};
