import React, { useMemo } from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Text, TextColor, TextSize } from '../../Text';
import { propsToClass } from '../../utils';

export interface InputLabelProps {
  /*
   * i18n key for the label text. Falls back to children if not provided.
   */
  label?: TranslationKey;

  /*
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

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
  stringLabel,
  children,
  className,
  size = 'sm',
  color = 'muted',
}) => {
  const { t } = useTranslation();

  // Resolve the label from the available sources
  const resolvedLabel = useMemo(() => {
    if (stringLabel) {
      return stringLabel;
    }

    if (label) {
      return t(label);
    }

    return children;
  }, [stringLabel, label, children, t]);

  return (
    <Text
      size={size}
      color={color}
      weight="medium"
      className={propsToClass('input-label', { className })}
    >
      {resolvedLabel}
    </Text>
  );
};
