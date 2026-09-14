import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import React from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon } from '../Icon';
import { Tooltip, TooltipProps } from '../Tooltip';
import { propsToClass } from '../utils';
import './Toggle.css';

export type ToggleVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleColor = 'neutral' | 'primary';

export interface ToggleProps {
  /*
   * Icon to display inside the toggle.
   */
  icon?: UiIconName;

  /*
   * Content to display inside the toggle. Used as an alternative to `icon`.
   */
  children?: React.ReactNode;

  /*
   * Sizes and colours a toggle drawing its own content as an icon
   * toggle, square rather than padded around its content.
   */
  square?: boolean;

  /*
   * Accessible label for the toggle button.
   */
  label: string;

  /*
   * Visual style of the toggle.
   * @default 'subtle'
   */
  variant?: ToggleVariant;

  /*
   * Size of the toggle.
   * @default 'md'
   */
  size?: ToggleSize;

  /*
   * Color scheme of the toggle.
   * @default 'neutral'
   */
  color?: ToggleColor;

  /*
   * Controlled pressed state.
   */
  pressed?: boolean;

  /*
   * Default pressed state for uncontrolled usage.
   */
  defaultPressed?: boolean;

  /*
   * Callback fired when pressed state changes.
   */
  onPressedChange?: (pressed: boolean) => void;

  /*
   * The value used when inside a ToggleGroup or RadioToggleGroup.
   */
  value?: string;

  /*
   * Tooltip shown on hover, explaining what the toggle does.
   */
  tooltip?: Omit<TooltipProps, 'children'>;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      icon,
      children,
      square,
      label,
      variant = 'subtle',
      size = 'md',
      color = 'neutral',
      pressed,
      defaultPressed,
      onPressedChange,
      value,
      tooltip,
      disabled,
      className,
    },
    ref,
  ) => {
    // Content drawn in place of an icon is text unless it is
    // sized as an icon.
    const isText = !icon && !square;
    const content = icon ? (
      <Icon name={icon} />
    ) : (
      children || <span className="toggle-label">{label}</span>
    );

    const toggle = (
      <TogglePrimitive
        ref={ref}
        aria-label={label}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={onPressedChange}
        value={value}
        disabled={disabled}
        className={propsToClass('toggle', {
          variant,
          size,
          color,
          text: isText,
          square,
          className,
        })}
      >
        {content}
      </TogglePrimitive>
    );

    if (tooltip) {
      return <Tooltip {...tooltip}>{toggle}</Tooltip>;
    }

    return toggle;
  },
);

Toggle.displayName = 'Toggle';
