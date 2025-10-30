import React, { InputHTMLAttributes } from 'react';
import { i18n } from '@minddrop/i18n';
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

  /**
   * Description to display below the field.
   */
  description?: React.ReactNode;

  /**
   * Error message to display below the field.
   */
  error?: React.ReactNode;
}

export const InvisibleTextField = React.forwardRef<
  HTMLInputElement,
  InvisibleTextFieldProps
>(
  (
    {
      children,
      className,
      label,
      size,
      color,
      weight,
      error,
      description,
      placeholder,
      ...other
    },
    ref,
  ) => (
    <div className={mapPropsToClasses({ className }, 'invisible-text-field')}>
      <input
        ref={ref}
        type="text"
        aria-label={label}
        className={mapPropsToClasses({ size, color, weight })}
        placeholder={i18n.t(placeholder)}
        {...other}
      />
      {description && <div className="description">{description}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  ),
);

InvisibleTextField.displayName = 'InvisibleTextField';
