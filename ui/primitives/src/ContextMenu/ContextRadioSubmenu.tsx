import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { useState } from 'react';
import { i18n } from '@minddrop/i18n';
import { IconProp } from '../IconRenderer';
import { MenuRadioGroup } from '../Menu/MenuRadioGroup';
import { MenuRadioItem } from '../Menu/MenuRadioItem';
import { Text } from '../Text';
import { TranslatableNode } from '../types';
import { ContextMenuPortal } from './ContextMenuPortal';
import { ContextMenuPositioner } from './ContextMenuPositioner';
import { ContextSubmenu } from './ContextSubmenu';
import { ContextSubmenuContent } from './ContextSubmenuContent';
import { ContextSubmenuTriggerItem } from './ContextSubmenuTriggerItem';

/* ============================================================
   TYPES
   ============================================================ */

export interface ContextRadioSubmenuItem {
  /**
   * The value this item represents.
   */
  value: string;

  /**
   * Label text. Strings are treated as i18n keys.
   */
  label: TranslatableNode;

  /**
   * Icon for the item.
   */
  icon?: IconProp;
}

export interface ContextRadioSubmenuProps {
  /**
   * Label for the trigger menu item. Strings are treated
   * as i18n keys and translated.
   */
  label: TranslatableNode;

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
  items: ContextRadioSubmenuItem[];

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
   CONTEXT RADIO SUBMENU
   A context menu item that opens a submenu containing a
   radio group. The selected value's label is displayed inline
   on the trigger, right-aligned in subtle text.

   Uses MenuPrimitive.Item (not RadioItem) to avoid a Base UI
   issue where RadioGroup/RadioItem inside a submenu breaks
   the hover-based auto-close behaviour.
   ============================================================ */

/** Renders a context menu submenu containing a radio group. */
export const ContextRadioSubmenu: React.FC<ContextRadioSubmenuProps> = ({
  label,
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

  // Use controlled value when provided, otherwise internal state
  const value = valueProp !== undefined ? valueProp : valueInternal;

  // Change handler - updates internal state and notifies parent
  const handleValueChange = (nextValue: string) => {
    if (valueProp === undefined) {
      setValueInternal(nextValue);
    }

    onValueChange?.(nextValue);
  };

  // Resolve the selected item's label for display on the trigger
  const selectedItem = items.find((item) => item.value === value);
  const selectedLabel = selectedItem
    ? typeof selectedItem.label === 'string'
      ? i18n.t(selectedItem.label)
      : selectedItem.label
    : null;

  return (
    <ContextSubmenu>
      {/* Trigger item showing the label and selected value */}
      <ContextSubmenuTriggerItem
        label={label}
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
      <ContextMenuPortal>
        <ContextMenuPositioner side="right" align="start" sideOffset={4}>
          <ContextSubmenuContent minWidth={minWidth}>
            <MenuRadioGroup value={value} onValueChange={handleValueChange}>
              {items.map((item) => (
                <MenuPrimitive.Item
                  key={item.value}
                  closeOnClick={false}
                  render={
                    <MenuRadioItem
                      value={item.value}
                      label={item.label}
                      icon={item.icon}
                    />
                  }
                />
              ))}
            </MenuRadioGroup>
          </ContextSubmenuContent>
        </ContextMenuPositioner>
      </ContextMenuPortal>
    </ContextSubmenu>
  );
};
