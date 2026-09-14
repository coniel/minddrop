import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { Menu } from '../Menu/Menu';
import { MenuSearchScope } from '../Menu/MenuSearchScope';
import { SearchableMenu } from '../SearchableMenu/SearchableMenu';
import { useDropdownSubmenu } from './DropdownSubmenu';

/* --- DropdownSubmenuContent ---
   Styled popup panel for nested submenus.
   Props are defined independently (not derived from
   DropdownMenuContentProps) to avoid a circular import. */

export interface DropdownSubmenuContentProps extends MenuPrimitive.Popup.Props {
  /*
   * Minimum width of the submenu panel in pixels.
   */
  minWidth?: number;

  /*
   * Class name applied to the submenu panel.
   */
  className?: string;

  /**
   * Enables a search field at the top of the submenu that
   * filters items by their label text.
   */
  searchable?: boolean;

  /**
   * Placeholder text for the search input. Can be an i18n key.
   */
  searchPlaceholder?: TranslationKey;

  /*
   * Plain string search placeholder used as-is without i18n
   * translation. Takes priority over `searchPlaceholder`.
   */
  stringSearchPlaceholder?: string;

  /**
   * Controlled search term. When provided, the consumer owns
   * filtering and menu items are listed as given.
   */
  searchTerm?: string;

  /**
   * Callback fired when the search term changes.
   */
  onSearchTermChange?: (searchTerm: string) => void;

  /**
   * Text shown when the submenu lists no items.
   */
  emptyText?: string;
}

export const DropdownSubmenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownSubmenuContentProps
>(
  (
    {
      children,
      minWidth,
      className,
      searchable,
      searchPlaceholder,
      stringSearchPlaceholder,
      searchTerm,
      onSearchTermChange,
      emptyText,
      ...other
    },
    ref,
  ) => {
    const submenu = useDropdownSubmenu();

    // Leaving the submenu when the menu around it navigates away
    function handleClose() {
      submenu?.setOpen(false);
    }

    return (
      <MenuPrimitive.Popup
        ref={ref}
        render={
          searchable ? (
            <SearchableMenu
              style={{ minWidth }}
              className={className}
              searchPlaceholder={searchPlaceholder}
              stringSearchPlaceholder={stringSearchPlaceholder}
              searchTerm={searchTerm}
              onSearchTermChange={onSearchTermChange}
              emptyText={emptyText}
            >
              {children}
            </SearchableMenu>
          ) : (
            /* A searchable menu hands its keyboard navigation to
               the submenu's items while it is open. A submenu with
               a search field of its own navigates them itself. */
            <Menu style={{ minWidth }} className={className}>
              <MenuSearchScope
                close={handleClose}
                itemId={submenu?.triggerIdRef.current}
              >
                {children}
              </MenuSearchScope>
            </Menu>
          )
        }
        {...other}
      />
    );
  },
);

DropdownSubmenuContent.displayName = 'DropdownSubmenuContent';
