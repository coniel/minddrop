import React, { InputHTMLAttributes } from 'react';
import { TextColor, TextSize, TextWeight } from '../types';
import { mapPropsToClasses } from '../utils';
import './InvisibleTextField.css';

export interface InvisibleTextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

export const InvisibleTextField = React.forwardRef<
  HTMLInputElement,
  InvisibleTextFieldProps
>(({ children, className, label, size, color, weight, ...other }, ref) => (
  <input
    ref={ref}
    type="text"
    aria-label={label}
    className={mapPropsToClasses(
      { className, size, color, weight },
      'invisible-text-field',
    )}
    {...other}
  />
));

InvisibleTextField.displayName = 'InvisibleTextField';
