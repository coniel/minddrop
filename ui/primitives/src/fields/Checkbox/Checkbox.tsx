import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Field } from '@base-ui/react/field';
import React, { createContext, useContext, useId } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { propsToClass } from '../../utils';
import './Checkbox.css';

/* ============================================================
   CHECKBOX GROUP CONTEXT
   ============================================================ */

interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);

function useCheckboxGroup() {
  return useContext(CheckboxGroupContext);
}

/* ============================================================
   CHECKBOX (primitive — unstyled indicator only)
   Use CheckboxField for the full label+checkbox combo.
   ============================================================ */

export interface CheckboxProps extends CheckboxPrimitive.Root.Props {
  /*
   * Class name applied to the indicator element.
   */
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...other }) => (
  <CheckboxPrimitive.Root
    className={propsToClass('checkbox-indicator', { className })}
    {...other}
  >
    <CheckboxPrimitive.Indicator>
      {/* Checkmark */}
      <svg className="checkbox-icon" viewBox="0 0 10 10" fill="none">
        <path
          d="M1.5 5L4 7.5L8.5 2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Indeterminate dash */}
      <svg
        className="checkbox-indeterminate-icon"
        viewBox="0 0 8 8"
        fill="none"
      >
        <path
          d="M1 4H7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

/* ============================================================
   CHECKBOX FIELD
   Checkbox indicator + label + optional description,
   wired to a Field.Root for accessibility.
   ============================================================ */

export interface CheckboxFieldProps {
  /*
   * Value used when inside a CheckboxGroup.
   */
  value?: string;

  /*
   * Label text. Can be an i18n key.
   */
  label?: string;

  /*
   * Label content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * Helper text below the label.
   */
  description?: string;

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
   * When true, the checkbox is in an indeterminate state.
   */
  indeterminate?: boolean;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  value,
  label,
  children,
  description,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  indeterminate,
  disabled: disabledProp,
  className,
}) => {
  const { t } = useTranslation();
  const id = useId();
  const group = useCheckboxGroup();

  // Derive checked/onChange from group context if present
  const isGrouped = group !== null && value !== undefined;
  const checked = isGrouped ? group!.value.includes(value!) : checkedProp;
  const disabled = disabledProp || group?.disabled;

  function handleCheckedChange(c: boolean) {
    if (isGrouped) {
      const next = c
        ? [...group!.value, value!]
        : group!.value.filter((v) => v !== value!);
      group!.onChange(next);
    } else {
      onCheckedChange?.(c);
    }
  }

  const labelText = label ? t(label) : children;
  const descriptionText = description ? t(description) : undefined;

  return (
    <Field.Root
      className={propsToClass('checkbox-field', { className })}
      disabled={disabled}
    >
      <Checkbox
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleCheckedChange}
        indeterminate={indeterminate}
        disabled={disabled}
      />
      <div className="checkbox-field-content">
        {labelText && (
          <Field.Label className="checkbox-field-label" htmlFor={id}>
            {labelText}
          </Field.Label>
        )}
        {descriptionText && (
          <Field.Description className="checkbox-field-description">
            {descriptionText}
          </Field.Description>
        )}
      </div>
    </Field.Root>
  );
};

/* ============================================================
   CHECKBOX GROUP
   Manages a set of CheckboxField children via context.
   Provides an optional "select all" checkbox.
   ============================================================ */

export interface CheckboxGroupProps {
  /*
   * Array of currently checked values (controlled).
   */
  value: string[];

  /*
   * Callback fired when the checked values change.
   */
  onChange: (value: string[]) => void;

  /*
   * All possible values in the group.
   * Required for the select-all checkbox to work.
   */
  options?: string[];

  /*
   * Group label rendered above the checkboxes.
   */
  label?: string;

  /*
   * When true, renders a "select all" checkbox above the group.
   * Requires the `options` prop.
   * @default false
   */
  selectAll?: boolean;

  /*
   * Label for the select-all checkbox.
   * @default 'Select all'
   */
  selectAllLabel?: string;

  /*
   * Disables all checkboxes in the group.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;

  /*
   * CheckboxField children.
   */
  children: React.ReactNode;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onChange,
  options,
  label,
  selectAll,
  selectAllLabel = 'Select all',
  disabled,
  className,
  children,
}) => {
  const { t } = useTranslation();

  const allChecked =
    options !== undefined &&
    options.length > 0 &&
    options.every((o) => value.includes(o));
  const someChecked =
    !allChecked &&
    options !== undefined &&
    options.some((o) => value.includes(o));

  function handleSelectAll(checked: boolean) {
    if (!options) return;
    onChange(checked ? [...options] : []);
  }

  return (
    <CheckboxGroupContext.Provider value={{ value, onChange, disabled }}>
      <div
        className={propsToClass('checkbox-group', { className })}
        role="group"
        aria-label={label ? t(label) : undefined}
      >
        {label && <div className="checkbox-group-label">{t(label)}</div>}
        {selectAll && options && (
          <>
            <CheckboxField
              label={selectAllLabel}
              checked={allChecked}
              indeterminate={someChecked}
              onCheckedChange={handleSelectAll}
              disabled={disabled}
            />
            <div
              role="separator"
              style={{
                height: 1,
                background: 'var(--border-subtle)',
                margin: '0',
              }}
            />
          </>
        )}
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
};
