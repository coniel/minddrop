import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';
import { propsToClass } from '../../utils';

export interface InputLabelProps {
  /*
   * i18n key for the label text. Falls back to children if not provided.
   */
  label?: string;

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

export const InputLabel: React.FC<InputLabelProps> = ({
  label,
  children,
  className,
  size = 'sm',
  color = 'muted',
}) => {
  const { t } = useTranslation();

  return (
    <Text
      size={size}
      color={color}
      weight="medium"
      className={propsToClass('input-label', { className })}
    >
      {label ? t(label) : children}
    </Text>
  );
};
