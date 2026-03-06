import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon } from '../Icon';
import { Tooltip, TooltipProps } from '../Tooltip';
import { propsToClass } from '../utils';
import './IconButton.css';

export type IconButtonVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type IconButtonColor =
  | 'neutral'
  | 'muted'
  | 'regular'
  | 'contrast'
  | 'primary'
  | 'danger'
  | 'inherit';
export type IconButtonDanger = 'on-hover' | 'always';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /*
   * The name of the icon to render.
   */
  icon?: UiIconName;

  /*
   * Icon can also be passed as a child for more control.
   * Ignored if the `icon` prop is provided.
   */
  children?: React.ReactNode;

  /*
   * The rendered element. Defaults to 'button'.
   */
  as?: React.ElementType;

  /*
   * Accessible label announced by screen readers.
   */
  label: string;

  /*
   * Visual style.
   * - `ghost`   — no background or border, appears on hover (default)
   * - `subtle`  — muted persistent background, no border; for dense panel UIs
   * - `outline` — bordered, background appears on hover
   * - `filled`  — bordered + background + shadow
   * @default 'ghost'
   */
  variant?: IconButtonVariant;

  /*
   * Icon color.
   * - `neutral`  — standard muted icon color (default)
   * - `muted`    — more receded, for secondary/supporting actions
   * - `contrast` — for icons on solid/dark surfaces
   * @default 'neutral'
   */
  color?: IconButtonColor;

  /*
   * Size. Heights match Button and Select for seamless toolbar composition.
   * @default 'md'
   */
  size?: IconButtonSize;

  /*
   * Renders the button in an active/toggled state.
   * Sets aria-pressed automatically.
   */
  active?: boolean;

  /*
   * Applies danger styling - shown on hover or always.
   */
  danger?: IconButtonDanger;

  /*
   * Tooltip configuration. When provided, wraps the button
   * in a Tooltip with the given props.
   */
  tooltip?: Omit<TooltipProps, 'children'>;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      children,
      as,
      className,
      label,
      variant = 'ghost',
      color = 'neutral',
      size = 'md',
      active,
      danger,
      disabled,
      tooltip,
      ...other
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const Component = as || 'button';

    const button = (
      <Component
        type="button"
        ref={ref}
        aria-label={t(label)}
        aria-pressed={active}
        disabled={disabled}
        className={propsToClass('icon-button', {
          variant,
          color,
          size,
          active,
          danger,
          disabled,
          className,
        })}
        {...other}
      >
        {icon ? <Icon name={icon} /> : children}
      </Component>
    );

    if (tooltip) {
      return <Tooltip {...tooltip}>{button}</Tooltip>;
    }

    return button;
  },
);

IconButton.displayName = 'IconButton';
