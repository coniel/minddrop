import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { propsToClass } from '../utils';
import './IconButton.css';

export type IconButtonVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type IconButtonColor = 'neutral' | 'muted' | 'contrast';
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
   * Also used as the default tooltip title if `tooltipTitle` is not set.
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
   * Tooltip title. Falls back to `label` if not provided.
   */
  tooltipTitle?: React.ReactNode;

  /*
   * Optional tooltip description shown below the title.
   */
  tooltipDescription?: React.ReactNode;
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
      disabled,
      tooltipTitle,
      tooltipDescription,
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
          disabled,
          className,
        })}
        {...other}
      >
        {icon ? <Icon name={icon} /> : children}
      </Component>
    );

    if (tooltipTitle || tooltipDescription) {
      return (
        <Tooltip
          title={tooltipTitle ?? t(label)}
          description={tooltipDescription}
        >
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);

IconButton.displayName = 'IconButton';
