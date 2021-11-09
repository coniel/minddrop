import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Text.css';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The content of the Text.
   */
  children?: React.ReactNode;

  /**
   * The color of the text.
   */
  color?: 'regular' | 'light' | 'contrast' | 'contrast-light';

  /**
   * The component used for the root node. Either a string to use a
   * HTML element or a component.
   */
  component?: React.ElementType;

  /**
   * The font size, regular is for standard UI text.
   */
  size?: 'tiny' | 'small' | 'regular' | 'large' | 'title';

  /**
   * The font weight.
   */
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
}

export const Text: FC<TextProps> = ({
  children,
  className,
  color,
  component,
  size,
  weight,
  ...other
}) => {
  const Component = component || 'span';
  return (
    <Component
      className={mapPropsToClasses({ className, color, size, weight }, 'text')}
      {...other}
    >
      {children}
    </Component>
  );
};
