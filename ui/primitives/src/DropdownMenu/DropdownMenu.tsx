import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC, useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { IconProp } from '../IconRenderer';
import { Menu } from '../Menu';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../Menu/ColorSelectionMenuItem';
import { MenuItem } from '../Menu/MenuItem';
import { MenuLabel } from '../Menu/MenuLabel';
import { MenuSeparator } from '../Menu/MenuSeparator';
import {
  MenuItemRenderer,
  MenuItemRendererProps,
  RadioMenuItemRenderer,
  RadioMenuItemRendererProps,
} from '../MenuItemRenderer';
import { MenuContents } from '../types';
import { generateMenu } from '../utils';
import './DropdownMenu.css';

/* ============================================================
   ROOT
   ============================================================ */

export type DropdownMenuProps = MenuPrimitive.Root.Props;

export const DropdownMenu = MenuPrimitive.Root;

/* ============================================================
   TRIGGER
   Direct re-export — consumers use the render prop pattern:
   <DropdownMenuTrigger render={<Button />} />
   This ensures Base UI can forward its keyboard/aria handlers
   onto the trigger element correctly.
   ============================================================ */

export type DropdownMenuTriggerProps = MenuPrimitive.Trigger.Props;

export const DropdownMenuTrigger = MenuPrimitive.Trigger;

/* ============================================================
   PORTAL
   ============================================================ */

export type DropdownMenuPortalProps = MenuPrimitive.Portal.Props;

export const DropdownMenuPortal = MenuPrimitive.Portal;

/* ============================================================
   POSITIONER
   ============================================================ */

export type DropdownMenuPositionerProps = MenuPrimitive.Positioner.Props;

export const DropdownMenuPositioner = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPositionerProps
>((props, ref) => (
  <MenuPrimitive.Positioner
    ref={ref}
    className="dropdown-menu-positioner"
    {...props}
  />
));

/* ============================================================
   CONTENT
   Renders the styled Menu panel inside Menu.Popup.
   Optionally generates items from a declarative content array.
   ============================================================ */

export interface DropdownMenuContentProps
  extends Omit<MenuPrimitive.Popup.Props, 'content'> {
  /*
   * Declarative item descriptors. When provided, menu items
   * are generated automatically alongside any JSX children.
   */
  content?: MenuContents;

  /*
   * Minimum width of the menu panel in pixels.
   */
  minWidth?: number;

  /*
   * Class name applied to the Menu panel.
   */
  className?: string;
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, content = [], minWidth, className, ...other }, ref) => {
  const generatedItems = useMemo(
    () =>
      generateMenu(
        {
          Item: DropdownMenuItem,
          Label: DropdownMenuLabel,
          Separator: DropdownMenuSeparator,
          Submenu: DropdownSubmenu,
          SubmenuTriggerItem: DropdownSubmenuTriggerItem,
          SubmenuContent: DropdownSubmenuContent,
          ColorSelectionItem: DropdownMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <MenuPrimitive.Popup
      ref={ref}
      render={
        <Menu style={{ minWidth }} className={className}>
          {generatedItems}
          {children}
        </Menu>
      }
      {...other}
    />
  );
});

DropdownMenuContent.displayName = 'DropdownMenuContent';

/* ============================================================
   SEPARATOR
   ============================================================ */

export type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = (
  props,
) => <MenuPrimitive.Separator render={<MenuSeparator />} {...props} />;

/* ============================================================
   LABEL
   ============================================================ */

export interface DropdownMenuLabelProps
  extends Omit<MenuPrimitive.GroupLabel.Props, 'children'> {
  children?: React.ReactNode;
  /*
   * Label string. Can be an i18n key. Translated internally.
   * Use children for non-string content.
   */
  label?: string;
}

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  children,
  label,
  ...other
}) => {
  const { t } = useTranslation();
  return (
    <MenuPrimitive.GroupLabel {...other}>
      <MenuLabel>{label ? t(label) : children}</MenuLabel>
    </MenuPrimitive.GroupLabel>
  );
};

/* ============================================================
   GROUP
   Wraps items in a Menu.Group with an optional label above.
   ============================================================ */

export interface DropdownMenuGroupProps extends MenuPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: string;
}

export const DropdownMenuGroup: FC<DropdownMenuGroupProps> = ({
  label,
  children,
  ...other
}) => (
  <MenuPrimitive.Group {...other}>
    {label && <DropdownMenuLabel label={label} />}
    {children}
  </MenuPrimitive.Group>
);

/* ============================================================
   ITEM
   ============================================================ */

export type DropdownMenuItemProps = MenuItemRendererProps;

export const DropdownMenuItem: FC<DropdownMenuItemProps> = (props) => (
  <MenuItemRenderer {...props} />
);

/* ============================================================
   RADIO GROUP + RADIO ITEM
   ============================================================ */

export type DropdownMenuRadioGroupProps = MenuPrimitive.RadioGroup.Props;

export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

export type DropdownMenuRadioItemProps = RadioMenuItemRendererProps;

export const DropdownMenuRadioItem: FC<DropdownMenuRadioItemProps> = (
  props,
) => (
  <RadioMenuItemRenderer
    itemIndicator={
      <MenuPrimitive.RadioItemIndicator>
        <Icon name="check" className="item-indicator" />
      </MenuPrimitive.RadioItemIndicator>
    }
    {...props}
  />
);

/* ============================================================
   COLOR SELECTION ITEM
   ============================================================ */

export interface DropdownMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onClick?: MenuPrimitive.Item.Props['onClick'];
  disabled?: boolean;
}

export const DropdownMenuColorSelectionItem: FC<
  DropdownMenuColorSelectionItemProps
> = ({ disabled, color, onClick, ...other }) => (
  <MenuPrimitive.Item
    disabled={disabled}
    onClick={onClick}
    render={<ColorSelectionMenuItem disabled={disabled} color={color} />}
    {...other}
  />
);

/* ============================================================
   SUBMENU
   ============================================================ */

export type DropdownSubmenuProps = MenuPrimitive.SubmenuRoot.Props;

export const DropdownSubmenu = MenuPrimitive.SubmenuRoot;

/* ============================================================
   SUBMENU TRIGGER ITEM
   ============================================================ */

export interface DropdownSubmenuTriggerItemProps
  extends Omit<MenuPrimitive.SubmenuTrigger.Props, 'children' | 'label'> {
  label?: string;
  icon?: IconProp;
  disabled?: boolean;
}

export const DropdownSubmenuTriggerItem: FC<
  DropdownSubmenuTriggerItemProps
> = ({ label, icon, disabled, ...other }) => (
  <MenuPrimitive.SubmenuTrigger
    render={
      <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
    }
    disabled={disabled}
    {...other}
  />
);

/* ============================================================
   SUBMENU CONTENT
   Uses the same styled Menu panel as DropdownMenuContent.
   ============================================================ */

export type DropdownSubmenuContentProps = Omit<
  DropdownMenuContentProps,
  'content'
>;

export const DropdownSubmenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownSubmenuContentProps
>(({ children, minWidth, className, ...other }, ref) => (
  <MenuPrimitive.Popup
    ref={ref}
    render={
      <Menu style={{ minWidth }} className={className}>
        {children}
      </Menu>
    }
    {...other}
  />
));

DropdownSubmenuContent.displayName = 'DropdownSubmenuContent';
