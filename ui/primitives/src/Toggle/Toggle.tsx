import React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { UiIconName } from '@minddrop/icons';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';
import './Toggle.css';

export type ToggleVariant = 'ghost' | 'subtle' | 'outline' | 'filled';
export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleColor = 'neutral' | 'primary';

export interface ToggleProps {
  /*
   * Icon to display inside the toggle.
   */
  icon: UiIconName;

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
      label,
      variant = 'subtle',
      size = 'md',
      color = 'neutral',
      pressed,
      defaultPressed,
      onPressedChange,
      value,
      disabled,
      className,
    },
    ref,
  ) => (
    <TogglePrimitive
      ref={ref}
      aria-label={label}
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={onPressedChange}
      value={value}
      disabled={disabled}
      className={propsToClass('toggle', { variant, size, color, className })}
    >
      <Icon name={icon} />
    </TogglePrimitive>
  ),
);

Toggle.displayName = 'Toggle';
