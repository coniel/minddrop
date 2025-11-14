import React, { FC } from 'react';
import { TextColor, TextSize, TextWeight } from '../types';
import { mapPropsToClasses } from '../utils';
import './Text.css';
import { i18n } from '@minddrop/i18n';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The content of the Text.
   */
  children?: React.ReactNode;

  /**
   * The i18n key for the text. If provided, this takes precedence
   * over children.
   */
  text?: string;

  /**
   * The color of the text.
   */
  color?: TextColor;

  /**
   * Whether the text is a paragraph. Applies paragraph styles.
   */
  paragraph?: boolean;

  /**
   * The component used for the root node. Either a string to use a
   * HTML element or a component.
   */
  as?: React.ElementType;

  /**
   * The font size, regular is for standard UI text.
   */
  size?: TextSize;

  /**
   * The font weight.
   */
  weight?: TextWeight;
}

export const Text: FC<TextProps> = ({
  as,
  children,
  className,
  color = 'regular',
  size = 'regular',
  paragraph = false,
  text,
  weight = 'regular',
  ...other
}) => {
  const Component = as || 'span';

  return (
    <Component
      className={mapPropsToClasses(
        { className, color, size, weight, paragraph },
        'text',
      )}
      {...other}
    >
      {text ? i18n.t(text) : children}
    </Component>
  );
};
