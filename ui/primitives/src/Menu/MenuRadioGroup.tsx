import React, { useState } from 'react';

/* ============================================================
   MENU RADIO GROUP CONTEXT
   Exposes the current value and change handler to child
   MenuRadioItem components.
   ============================================================ */

export interface MenuRadioGroupContext {
  /* The currently selected value. */
  value: string;

  /* Selects a new value. */
  onValueChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<MenuRadioGroupContext | null>(
  null,
);

/* Returns context when inside a MenuRadioGroup, null otherwise.
   Safe to call without a provider — used by MenuRadioItem to
   support both standalone and Base UI renderer modes. */
export function useMenuRadioGroupContext(): MenuRadioGroupContext | null {
  return React.useContext(RadioGroupContext);
}

/* ============================================================
   MENU RADIO GROUP
   Groups MenuRadioItem children so only one can be selected
   at a time. Supports both controlled and uncontrolled usage.
   ============================================================ */

export interface MenuRadioGroupProps {
  /*
   * Controlled selected value.
   */
  value?: string;

  /*
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /*
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: string) => void;

  /*
   * The group's children (MenuRadioItem elements).
   */
  children: React.ReactNode;
}

export const MenuRadioGroup: React.FC<MenuRadioGroupProps> = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  children,
}) => {
  /* Track internal state for uncontrolled usage */
  const [valueInternal, setValueInternal] = useState(defaultValue);

  /* Use controlled value when provided, otherwise internal state */
  const value = valueProp !== undefined ? valueProp : valueInternal;

  /* Change handler — updates internal state and notifies parent */
  const handleValueChange = (nextValue: string) => {
    if (valueProp === undefined) {
      setValueInternal(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value, onValueChange: handleValueChange }}
    >
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
};
