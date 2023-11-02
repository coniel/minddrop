import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { Text, TextProps } from '../Text';
import './HelperText.css';

export interface HelperTextProps extends TextProps {
  /**
   * I18N key of translatable helper text.
   */
  text?: string;

  /**
   * Children can be passed for more control over the
   * text rendering.
   */
  children?: React.ReactNode;
}

export const HelperText: FC<HelperTextProps> = ({
  children,
  text,
  className,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <Text
      className={mapPropsToClasses({ className }, 'helper-text')}
      size="tiny"
      weight="medium"
      color="light"
      {...other}
    >
      {text ? t(text) : null}
      {children}
    </Text>
  );
};
