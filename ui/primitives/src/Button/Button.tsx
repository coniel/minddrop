import React, { useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { IconProp, IconRenderer } from '../IconRenderer';
import { propsToClass } from '../utils';
import './Button.css';

export type ButtonVariant = 'ghost' | 'subtle' | 'outline' | 'filled' | 'solid';
export type ButtonColor = 'neutral' | 'primary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonDanger = 'on-hover' | 'always';

export interface ButtonBaseProps {
  /*
   * Button content. Use `label` for i18n keys.
   */
  children?: React.ReactNode;

  /*
   * i18n key for the button label.
   */
  label?: string;

  /*
   * Visual style of the button.
   * - `ghost`   — no background or border, appears on hover
   * - `subtle`  — muted persistent background, no border; for dense panel UIs
   * - `outline` — bordered, background appears on hover
   * - `filled`  — bordered + background + shadow; default for most actions
   * - `solid`   — high contrast filled; for primary call-to-action
   * @default 'ghost'
   */
  variant?: ButtonVariant;

  /*
   * Color role.
   * @default 'neutral'
   */
  color?: ButtonColor;

  /*
   * Size. Matches Select and IconButton for seamless toolbar composition.
   * @default 'md'
   */
  size?: ButtonSize;

  /*
   * Icon placed before the label.
   */
  startIcon?: IconProp;

  /*
   * Icon placed after the label.
   */
  endIcon?: IconProp;

  /*
   * Renders the button in an active/toggled state.
   */
  active?: boolean;

  /*
   * Applies danger styling — shown on hover or always.
   */
  danger?: ButtonDanger;

  /*
   * Disables the button.
   */
  disabled?: boolean;

  /*
   * Renders as an anchor tag when provided.
   */
  href?: string;
}

export interface ButtonProps
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {}

export interface LinkButtonProps
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> {
  href: string;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | LinkButtonProps
>(
  (
    {
      variant = 'ghost',
      color = 'neutral',
      size = 'md',
      danger,
      active,
      disabled = false,
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

    const classes = propsToClass('button', {
      variant,
      size,
      color: color !== 'neutral' ? color : undefined,
      danger,
      active,
      disabled,
      startIcon: Boolean(startIcon) || undefined,
      endIcon: Boolean(endIcon) || undefined,
      className,
    });

    const content = useMemo(
      () => (
        <>
          <IconRenderer icon={startIcon} className="icon" />
          {label ? t(label) : children}
          <IconRenderer icon={endIcon} className="icon" />
        </>
      ),
      [startIcon, label, children, endIcon, t],
    );

    if (href) {
      return (
        <a
          ref={ref as React.MutableRefObject<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-disabled={disabled}
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
        data-active={active || undefined}
        {...(other as ButtonProps)}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
