import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
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
import './ContextMenu.css';

/* ============================================================
   ROOT
   ============================================================ */

export type ContextMenuProps = ContextMenuPrimitive.Root.Props;

export const ContextMenu = ContextMenuPrimitive.Root;

/* ============================================================
   TRIGGER
   Wraps children as the right-click target area.
   Unlike DropdownMenuTrigger, this uses children rather than
   a render prop since the trigger is a region, not a button.
   ============================================================ */

export interface ContextMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const ContextMenuTrigger: FC<ContextMenuTriggerProps> = ({
  children,
  className,
}) => (
  <ContextMenuPrimitive.Trigger className={className}>
    {children}
  </ContextMenuPrimitive.Trigger>
);

/* ============================================================
   PORTAL
   ============================================================ */

export type ContextMenuPortalProps = ContextMenuPrimitive.Portal.Props;

export const ContextMenuPortal = ContextMenuPrimitive.Portal;

/* ============================================================
   POSITIONER
   ============================================================ */

export type ContextMenuPositionerProps = ContextMenuPrimitive.Positioner.Props;

export const ContextMenuPositioner = React.forwardRef<
  HTMLDivElement,
  ContextMenuPositionerProps
>((props, ref) => (
  <ContextMenuPrimitive.Positioner
    ref={ref}
    className="context-menu-positioner"
    {...props}
  />
));

ContextMenuPositioner.displayName = 'ContextMenuPositioner';

/* ============================================================
   CONTENT
   ============================================================ */

export interface ContextMenuContentProps
  extends Omit<ContextMenuPrimitive.Popup.Props, 'content'> {
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

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ children, content = [], minWidth, className, ...other }, ref) => {
  const generatedItems = useMemo(
    () =>
      generateMenu(
        {
          Item: ContextMenuItem,
          Label: ContextMenuLabel,
          Separator: ContextMenuSeparator,
          Submenu: ContextSubmenu,
          SubmenuTriggerItem: ContextSubmenuTriggerItem,
          SubmenuContent: ContextSubmenuContent,
          ColorSelectionItem: ContextMenuColorSelectionItem,
        },
        content,
      ),
    [content],
  );

  return (
    <ContextMenuPrimitive.Popup
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

ContextMenuContent.displayName = 'ContextMenuContent';

/* ============================================================
   SEPARATOR
   ============================================================ */

export type ContextMenuSeparatorProps = ContextMenuPrimitive.Separator.Props;

export const ContextMenuSeparator: FC<ContextMenuSeparatorProps> = (props) => (
  <ContextMenuPrimitive.Separator render={<MenuSeparator />} {...props} />
);

/* ============================================================
   GROUP
   Wraps items in a Menu.Group with an optional label above.
   ============================================================ */

export interface DropdownMenuGroupProps
  extends ContextMenuPrimitive.Group.Props {
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
  <ContextMenuPrimitive.Group {...other}>
    {label && <ContextMenuLabel label={label} />}
    {children}
  </ContextMenuPrimitive.Group>
);

/* ============================================================
   LABEL
   ============================================================ */

export interface ContextMenuLabelProps
  extends Omit<ContextMenuPrimitive.GroupLabel.Props, 'children'> {
  children?: React.ReactNode;
  /*
   * Label string. Can be an i18n key. Translated internally.
   * Use children for non-string content.
   */
  label?: string;
}

export const ContextMenuLabel: FC<ContextMenuLabelProps> = ({
  children,
  label,
  ...other
}) => {
  const { t } = useTranslation();
  return (
    <ContextMenuPrimitive.GroupLabel {...other}>
      <MenuLabel>{label ? t(label) : children}</MenuLabel>
    </ContextMenuPrimitive.GroupLabel>
  );
};

/* ============================================================
   GROUP
   ============================================================ */

export interface ContextMenuGroupProps
  extends ContextMenuPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: string;
}

export const ContextMenuGroup: FC<ContextMenuGroupProps> = ({
  label,
  children,
  ...other
}) => (
  <ContextMenuPrimitive.Group {...other}>
    {label && <ContextMenuLabel label={label} />}
    {children}
  </ContextMenuPrimitive.Group>
);

/* ============================================================
   ITEM
   ============================================================ */

export type ContextMenuItemProps = MenuItemRendererProps;

export const ContextMenuItem: FC<ContextMenuItemProps> = (props) => (
  <MenuItemRenderer {...props} />
);

/* ============================================================
   RADIO GROUP + RADIO ITEM
   ============================================================ */

export type ContextMenuRadioGroupProps = ContextMenuPrimitive.RadioGroup.Props;

export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export type ContextMenuRadioItemProps = RadioMenuItemRendererProps;

export const ContextMenuRadioItem: FC<ContextMenuRadioItemProps> = (props) => (
  <RadioMenuItemRenderer
    itemIndicator={
      <ContextMenuPrimitive.RadioItemIndicator>
        <Icon name="check" className="item-indicator" />
      </ContextMenuPrimitive.RadioItemIndicator>
    }
    {...props}
  />
);

/* ============================================================
   COLOR SELECTION ITEM
   ============================================================ */

export interface ContextMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onClick?: ContextMenuPrimitive.Item.Props['onClick'];
  disabled?: boolean;
}

export const ContextMenuColorSelectionItem: FC<
  ContextMenuColorSelectionItemProps
> = ({ disabled, color, onClick, ...other }) => (
  <ContextMenuPrimitive.Item
    disabled={disabled}
    onClick={onClick}
    render={<ColorSelectionMenuItem disabled={disabled} color={color} />}
    {...other}
  />
);

/* ============================================================
   SUBMENU
   ============================================================ */

export type ContextSubmenuProps = ContextMenuPrimitive.SubmenuRoot.Props;

export const ContextSubmenu = ContextMenuPrimitive.SubmenuRoot;

/* ============================================================
   SUBMENU TRIGGER ITEM
   ============================================================ */

export interface ContextSubmenuTriggerItemProps
  extends Omit<
    ContextMenuPrimitive.SubmenuTrigger.Props,
    'children' | 'label'
  > {
  label?: string;
  icon?: IconProp;
  disabled?: boolean;
}

export const ContextSubmenuTriggerItem: FC<ContextSubmenuTriggerItemProps> = ({
  label,
  icon,
  disabled,
  ...other
}) => (
  <ContextMenuPrimitive.SubmenuTrigger
    render={
      <MenuItem hasSubmenu label={label} icon={icon} disabled={disabled} />
    }
    disabled={disabled}
    {...other}
  />
);

/* ============================================================
   SUBMENU CONTENT
   ============================================================ */

export type ContextSubmenuContentProps = Omit<
  ContextMenuContentProps,
  'content'
>;

export const ContextSubmenuContent = React.forwardRef<
  HTMLDivElement,
  ContextSubmenuContentProps
>(({ children, minWidth, className, ...other }, ref) => (
  <ContextMenuPrimitive.Popup
    ref={ref}
    render={
      <Menu style={{ minWidth }} className={className}>
        {children}
      </Menu>
    }
    {...other}
  />
));

ContextSubmenuContent.displayName = 'ContextSubmenuContent';
