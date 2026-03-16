import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { useMemo, useState } from 'react';
import { i18n } from '@minddrop/i18n';
import { IconProp } from '../IconRenderer';
import { MenuRadioGroup } from '../Menu/MenuRadioGroup';
import { MenuRadioItem } from '../Menu/MenuRadioItem';
import { Text } from '../Text';
import { TranslatableNode } from '../types';
import { DropdownMenuPortal } from './DropdownMenuPortal';
import { DropdownMenuPositioner } from './DropdownMenuPositioner';
import { DropdownSubmenu } from './DropdownSubmenu';
import { DropdownSubmenuContent } from './DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from './DropdownSubmenuTriggerItem';

/* ============================================================
   TYPES
   ============================================================ */

export interface DropdownRadioSubmenuItem {
  /**
   * The value this item represents.
   */
  value: string;

  /**
   * Label text. Strings are treated as i18n keys.
   */
  label?: TranslatableNode;

  /**
   * Plain string label rendered without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Icon for the item.
   */
  icon?: IconProp;
}

export interface DropdownRadioSubmenuProps {
  /**
   * Label for the trigger menu item. Strings are treated
   * as i18n keys and translated.
   */
  label?: TranslatableNode;

  /**
   * Plain string label for the trigger, rendered without
   * i18n translation. Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Icon for the trigger menu item.
   */
  icon?: IconProp;

  /**
   * Controlled selected value.
   */
  value?: string;

  /**
   * Default selected value for uncontrolled usage.
   */
  defaultValue?: string;

  /**
   * Callback fired when the selected value changes.
   */
  onValueChange?: (value: string) => void;

  /**
   * Radio items to display in the submenu.
   */
  items: DropdownRadioSubmenuItem[];

  /**
   * Prevents interaction with the trigger.
   */
  disabled?: boolean;

  /**
   * Minimum width of the submenu panel in pixels.
   */
  minWidth?: number;
}

/* ============================================================
   DROPDOWN RADIO SUBMENU
   A dropdown menu item that opens a submenu containing a
   radio group. The selected value's label is displayed inline
   on the trigger, right-aligned in subtle text.

   Uses MenuPrimitive.Item (not RadioItem) to avoid a Base UI
   issue where RadioGroup/RadioItem inside a submenu breaks
   the hover-based auto-close behaviour.
   ============================================================ */

/** Renders a dropdown submenu containing a radio group. */
export const DropdownRadioSubmenu: React.FC<DropdownRadioSubmenuProps> = ({
  label,
  stringLabel,
  icon,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  items,
  disabled,
  minWidth,
}) => {
  // Track internal state for uncontrolled usage
  const [valueInternal, setValueInternal] = useState(defaultValue);

  // Resolve the selected item's label for display on the trigger
  const value = valueProp !== undefined ? valueProp : valueInternal;

  const selectedLabel = useMemo(() => {
    const selectedItem = items.find((item) => item.value === value);

    if (!selectedItem) {
      return null;
    }

    if (selectedItem.stringLabel) {
      return selectedItem.stringLabel;
    }

    if (typeof selectedItem.label === 'string') {
      return i18n.t(selectedItem.label);
    }

    return selectedItem.label;
  }, [items, value]);

  // Change handler - updates internal state and notifies parent
  const handleValueChange = (nextValue: string) => {
    if (valueProp === undefined) {
      setValueInternal(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <DropdownSubmenu>
      {/* Trigger item showing the label and selected value */}
      <DropdownSubmenuTriggerItem
        label={label}
        stringLabel={stringLabel}
        icon={icon}
        disabled={disabled}
        trailingIcon={
          selectedLabel ? (
            <Text color="subtle" size="sm">
              {selectedLabel}
            </Text>
          ) : null
        }
      />

      {/* Submenu popup with radio items */}
      <DropdownMenuPortal>
        <DropdownMenuPositioner side="right" align="start" sideOffset={4}>
          <DropdownSubmenuContent minWidth={minWidth}>
            <MenuRadioGroup value={value} onValueChange={handleValueChange}>
              {items.map((item) => (
                <MenuPrimitive.Item
                  key={item.value}
                  closeOnClick={false}
                  render={
                    <MenuRadioItem
                      value={item.value}
                      label={item.label}
                      stringLabel={item.stringLabel}
                      icon={item.icon}
                    />
                  }
                />
              ))}
            </MenuRadioGroup>
          </DropdownSubmenuContent>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownSubmenu>
  );
};
