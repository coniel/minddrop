import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { TextColor, TextSize, TextWeight } from '../types';
import './InvisibleTextField.css';

export interface InvisibleTextFieldProps
  extends React.HTMLAttributes<HTMLInputElement> {
  /**
   * Hidden label used for accesability.
   */
  label: string;

  /**
   * Placeholder text.
   */
  placeholder: string;

  /**
   * Size of the text.
   */
  size?: TextSize;

  /**
   * Color of the text.
   */
  color?: TextColor;

  /**
   * The weight of the text.
   */
  weight?: TextWeight;
}

export const InvisibleTextField: FC<InvisibleTextFieldProps> = ({
  children,
  className,
  label,
  size,
  color,
  weight,
  ...other
}) => {
  return (
    <input
      type="text"
      aria-label={label}
      className={mapPropsToClasses(
        { className, size, color, weight },
        'invisible-text-field',
      )}
      {...other}
    />
  );
};
