import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { useMemo } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ActionMenuItem } from '../ActionMenuItem';
import { Menu } from '../Menu';
import { SearchableMenu } from '../SearchableMenu';
import { MenuContents } from '../types';
import { generateMenu } from '../utils';
import { DropdownMenuColorSelectionItem } from './DropdownMenuColorSelectionItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownSubmenu } from './DropdownSubmenu';
import { DropdownSubmenuContent } from './DropdownSubmenuContent';
import { DropdownSubmenuTriggerItem } from './DropdownSubmenuTriggerItem';

/* --- DropdownMenuContent ---
   Renders the styled Menu panel inside Menu.Popup.
   Optionally generates items from a declarative content array. */

export interface DropdownMenuContentProps
  extends Omit<MenuPrimitive.Popup.Props, 'content'> {
  /**
   * Declarative item descriptors. When provided, menu items
   * are generated automatically alongside any JSX children.
   */
  content?: MenuContents;

  /**
   * Minimum width of the menu panel in pixels.
   */
  minWidth?: number;

  /**
   * Class name applied to the Menu panel.
   */
  className?: string;

  /**
   * Enables a search field at the top of the menu that
   * filters items by their label text.
   */
  searchable?: boolean;

  /**
   * Placeholder text for the search input. Can be an i18n key.
   */
  searchPlaceholder?: TranslationKey;
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    {
      children,
      content = [],
      minWidth,
      className,
      searchable,
      searchPlaceholder,
      ...other
    },
    ref,
  ) => {
    // Generate menu items from the declarative content array
    const generatedItems = useMemo(
      () =>
        generateMenu(
          {
            Item: ActionMenuItem,
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

    // Menu content shared between both variants
    const menuContent = (
      <>
        {generatedItems}
        {children}
      </>
    );

    return (
      <MenuPrimitive.Popup
        ref={ref}
        render={
          searchable ? (
            <SearchableMenu
              style={{ minWidth }}
              className={className}
              searchPlaceholder={searchPlaceholder}
            >
              {menuContent}
            </SearchableMenu>
          ) : (
            <Menu style={{ minWidth }} className={className}>
              {menuContent}
            </Menu>
          )
        }
        {...other}
      />
    );
  },
);

DropdownMenuContent.displayName = 'DropdownMenuContent';
