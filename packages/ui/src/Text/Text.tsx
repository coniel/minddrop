import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { TextColor, TextSize, TextWeight } from '../types';
import './Text.css';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The content of the Text.
   */
  children?: React.ReactNode;

  /**
   * The color of the text.
   */
  color?: TextColor;

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
  children,
  className,
  as,
  color = 'regular',
  size = 'regular',
  weight = 'regular',
  ...other
}) => {
  const Component = as || 'span';
  return (
    <Component
      className={mapPropsToClasses({ className, color, size, weight }, 'text')}
      {...other}
    >
      {children}
    </Component>
  );
};
