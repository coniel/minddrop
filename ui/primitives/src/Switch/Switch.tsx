import { Field } from '@base-ui/react/field';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import { propsToClass } from '../utils';
import './Switch.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /*
   * Size of the switch track.
   * @default 'md'
   */
  size?: SwitchSize;

  /*
   * Controlled checked state.
   */
  checked?: boolean;

  /*
   * Default checked state for uncontrolled usage.
   */
  defaultChecked?: boolean;

  /*
   * Callback fired when checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      size = 'md',
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      className,
    },
    ref,
  ) => (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={propsToClass('switch', { size, className })}
    >
      <SwitchPrimitive.Thumb className="switch-thumb" />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = 'Switch';

/* ============================================================
   SWITCH FIELD
   Switch paired with label and description via Field.Root.
   ============================================================ */

export interface SwitchFieldProps extends SwitchProps {
  /*
   * Label text. Can be an i18n key.
   */
  label?: string;

  /*
   * Helper text displayed below the label.
   * Can be an i18n key.
   */
  description?: string;
}

export const SwitchField = React.forwardRef<HTMLDivElement, SwitchFieldProps>(
  ({ label, description, size = 'md', ...switchProps }, ref) => {
    const { t } = useTranslation();

    return (
      <Field.Root ref={ref} disabled={switchProps.disabled}>
        <div className="switch-field">
          <Switch size={size} {...switchProps} />
          {(label || description) && (
            <div className="switch-field-content">
              {label && (
                <Field.Label className="switch-field-label">
                  {t(label)}
                </Field.Label>
              )}
              {description && (
                <Field.Description className="switch-field-description">
                  {t(description)}
                </Field.Description>
              )}
            </div>
          )}
        </div>
      </Field.Root>
    );
  },
);

SwitchField.displayName = 'SwitchField';
