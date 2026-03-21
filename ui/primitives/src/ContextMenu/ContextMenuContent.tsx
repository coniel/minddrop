import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import React, { useMemo } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ActionMenuItem } from '../ActionMenuItem';
import { Menu } from '../Menu';
import { SearchableMenu } from '../SearchableMenu';
import { MenuContents } from '../types';
import { generateMenu } from '../utils';
import { ContextMenuColorSelectionItem } from './ContextMenuColorSelectionItem';
import { ContextMenuLabel } from './ContextMenuLabel';
import { ContextMenuSeparator } from './ContextMenuSeparator';
import { ContextSubmenu } from './ContextSubmenu';
import { ContextSubmenuContent } from './ContextSubmenuContent';
import { ContextSubmenuTriggerItem } from './ContextSubmenuTriggerItem';

/* --- ContextMenuContent ---
   Renders the styled Menu panel inside ContextMenu.Popup.
   Optionally generates items from a declarative content array. */

export interface ContextMenuContentProps
  extends Omit<ContextMenuPrimitive.Popup.Props, 'content'> {
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

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
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

    // Menu content shared between both variants
    const menuContent = (
      <>
        {generatedItems}
        {children}
      </>
    );

    return (
      <ContextMenuPrimitive.Popup
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

ContextMenuContent.displayName = 'ContextMenuContent';
