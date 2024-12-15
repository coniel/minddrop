import React, { useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';
import { IconProp, IconRenderer } from '../IconRenderer';
import './Button.css';

export interface ButtonBaseProps {
  /**
   * The content of the button. If using an i18n label, use the
   * `label` prop instead.
   */
  children?: React.ReactNode;

  /**
   * If `true`, the component is disabled.
   */
  disabled?: boolean;

  /**
   * Icon placed after the children.
   */
  endIcon?: IconProp;

  /**
   * If `true`, the button will take up the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href?: string;

  /**
   * The i18n key for the label.
   * If not using an i18n label, pass in the label as a child instead.
   */
  label?: string;

  /**
   * The size of the button.
   * `large` is intended for call to action buttons.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Icon placed before the children.
   */
  startIcon?: IconProp;

  /**
   * The variant to use based on the action type.
   */
  variant?: 'neutral' | 'contained' | 'primary' | 'text' | 'danger';
}

export interface ButtonProps
  extends ButtonBaseProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface LinkButtonProps
  extends ButtonBaseProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | LinkButtonProps
>(
  (
    {
      disabled = false,
      fullWidth = false,
      size = 'medium',
      variant = 'neutral',
      label,
      href,
      startIcon,
      endIcon,
      children,
      className,
      ...other
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const content = useMemo(
      () => (
        <>
          <IconRenderer icon={startIcon} className="start-icon" />
          {label ? t(label) : children}
          <IconRenderer icon={endIcon} className="end-icon" />
        </>
      ),
      [startIcon, label, children, endIcon, t],
    );
    const classes = useMemo(
      () =>
        mapPropsToClasses(
          {
            className,
            fullWidth,
            size,
            variant,
          },
          'button',
        ),
      [className, fullWidth, size, variant],
    );

    if (href) {
      return (
        <a
          ref={ref as React.MutableRefObject<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(other as Partial<LinkButtonProps>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type="button"
        ref={ref as React.MutableRefObject<HTMLButtonElement>}
        disabled={disabled}
        className={classes}
        {...(other as ButtonProps)}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
