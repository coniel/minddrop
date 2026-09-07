import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { FC } from 'react';
import { IconProp } from '../IconRenderer';
import { useMenuKeepsFocus } from '../Menu/MenuFocusContext';
import { MenuItem } from '../Menu/MenuItem';
import { TranslatableNode } from '../types';

/* --- ContextSubmenuTriggerItem ---
   The trigger item that opens a nested submenu. */

type SubmenuTriggerMouseEnterHandler = NonNullable<
  ContextMenuPrimitive.SubmenuTrigger.Props['onMouseEnter']
>;

export interface ContextSubmenuTriggerItemProps
  extends Omit<
    ContextMenuPrimitive.SubmenuTrigger.Props,
    'children' | 'label'
  > {
  label?: TranslatableNode;
  stringLabel?: string;
  icon?: IconProp;
  disabled?: boolean;
  trailingIcon?: React.ReactNode;

  /**
   * Whether the pointer entering the item moves the menu's focus onto
   * it. The hover styling is unaffected. Defaults to false while an
   * item of the menu keeps the focus (e.g. a rename field), true
   * otherwise.
   */
  focusOnHover?: boolean;
}

export const ContextSubmenuTriggerItem: FC<ContextSubmenuTriggerItemProps> = ({
  label,
  stringLabel,
  icon,
  disabled,
  trailingIcon,
  focusOnHover,
  onMouseEnter,
  ...other
}) => {
  const keepsFocus = useMenuKeepsFocus();
  const focusesOnHover = focusOnHover ?? !keepsFocus;

  // Cancel Base UI's own mouse enter handler, which activates the
  // trigger and focuses it, when focusing on hover is disabled.
  const handleMouseEnter: SubmenuTriggerMouseEnterHandler = (event) => {
    onMouseEnter?.(event);

    if (!focusesOnHover) {
      event.preventBaseUIHandler();
    }
  };

  return (
    <ContextMenuPrimitive.SubmenuTrigger
      render={
        <MenuItem
          hasSubmenu
          label={label}
          stringLabel={stringLabel}
          icon={icon}
          disabled={disabled}
          trailingIcon={trailingIcon}
        />
      }
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      {...other}
    />
  );
};
