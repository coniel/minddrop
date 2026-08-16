import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { fuzzySearch } from '@minddrop/utils';
import { ActionMenuItemProps } from '../ActionMenuItem';
import { Icon } from '../Icon';
import { MenuItem } from '../Menu/MenuItem';
import {
  MenuSearchContextProvider,
  MenuSearchContextValue,
  MenuSearchRegistration,
} from '../Menu/MenuSearchContext';
import { VerticalScrollArea } from '../ScrollArea';
import { TextInput, TextInputVariant } from '../fields/TextInput';
import { useNavigableList } from '../hooks';
import { propsToClass } from '../utils';
import { SearchableMenuVirtualizedList } from './SearchableMenuVirtualizedList';
import './SearchableMenu.css';

/* --- SearchableMenu ---
   A menu variant with a search field at the top that filters
   items by their label text. Items register their props via
   MenuSearchContext on mount so the menu can filter by label
   and render matched items from the registry. Navigation is
   handled by useNavigableList rather than Base UI's composite
   navigation, so focus always stays on the search input.
   Lists with more than 50 items are automatically virtualized. */

/** Lists exceeding this count are virtualized */
const VIRTUALIZE_THRESHOLD = 50;

export interface SearchableMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the menu.
   */
  children?: React.ReactNode;

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
   * Visual style of the search input.
   * @default 'subtle'
   */
  searchVariant?: TextInputVariant;

  /**
   * Controlled search term. When provided, the consumer owns
   * filtering and registered items are listed as given rather than
   * being matched against the term.
   */
  searchTerm?: string;

  /**
   * Callback fired when the search term changes.
   */
  onSearchTermChange?: (searchTerm: string) => void;

  /**
   * Text shown when no items are listed.
   */
  emptyText?: string;

  /**
   * When `true`, the item list is capped in height and scrolls.
   */
  scrollable?: boolean;
}

/**
 * Renders a menu with a search field that filters items by label text.
 */
export const SearchableMenu = React.forwardRef<
  HTMLDivElement,
  SearchableMenuProps
>(
  (
    {
      children,
      className,
      searchPlaceholder,
      stringSearchPlaceholder,
      searchVariant = 'subtle',
      searchTerm: searchTermProp,
      onSearchTermChange,
      emptyText,
      scrollable,
      ...other
    },
    ref,
  ) => {
    const registryRef = useRef(new Map<string, MenuSearchRegistration>());
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [internalSearchTerm, setInternalSearchTerm] = useState('');

    // The consumer owns both the term and the filtering when a
    // search term is provided
    const controlled = searchTermProp !== undefined;
    const searchTerm = controlled ? searchTermProp : internalSearchTerm;

    // Update the search term, reporting it to the consumer
    const setSearchTerm = useCallback(
      (term: string) => {
        if (!controlled) {
          setInternalSearchTerm(term);
        }

        onSearchTermChange?.(term);
      },
      [controlled, onSearchTermChange],
    );

    // Ordered list of registered item IDs, maintained by
    // register/unregister. Stored as state so useMemo consumers
    // re-derive when items change.
    const [orderedIds, setOrderedIds] = useState<string[]>([]);

    // Build filtered item IDs from the registry using fuzzy search
    const isSearchActive = searchTerm.length > 0;
    const virtualized = orderedIds.length > VIRTUALIZE_THRESHOLD;

    const activeIds = useMemo(() => {
      // Registered items are already filtered by the consumer when
      // the search term is controlled
      if (!isSearchActive || controlled) {
        return orderedIds;
      }

      // Build parallel arrays of IDs and text values
      const ids: string[] = [];
      const textValues: string[] = [];

      registryRef.current.forEach((registration, id) => {
        ids.push(id);
        textValues.push(resolveTextValue(registration.propsRef.current));
      });

      // Fuzzy match returns the matched text values in ranked order
      const matches = fuzzySearch(textValues, searchTerm);

      // Map matched text values back to their IDs,
      // preserving the fuzzy search ranking
      return matches.reduce<string[]>((result, matchedText) => {
        const index = textValues.indexOf(matchedText);

        if (index !== -1) {
          result.push(ids[index]);
        }

        return result;
      }, []);
    }, [searchTerm, isSearchActive, controlled, orderedIds]);

    // Navigable list for all items. No initial highlight when
    // not searching so the menu opens without a selection.
    const { highlightedIndex, getInputProps, getItemProps } = useNavigableList({
      itemCount: activeIds.length,
      initialIndex: isSearchActive ? 0 : -1,
      onSelect: handleSelectItem,
      onEscape: (event) => {
        if (searchTerm) {
          setSearchTerm('');
          event.stopPropagation();
        }
      },
    });

    // Whether to render items from the registry instead of
    // rendering children directly. Active during search or when
    // the list is virtualized (children are hidden in both cases).
    const renderFromRegistry = isSearchActive || virtualized;

    // Auto-focus the search input after the popup is mounted,
    // retrying shortly after as the menu's focus management may
    // move focus during opening
    useEffect(() => {
      const frame = requestAnimationFrame(() => {
        // Prevent the browser's scroll-to-reveal, which fights
        // consumer-driven scrolling of partially visible menus
        inputRef.current?.focus({ preventScroll: true });
      });

      const timeout = window.setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);

      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timeout);
      };
    }, []);

    // Reclaim focus from other menu elements while mounted, so
    // typing goes to the search input even when the menu is a
    // hover-opened submenu whose trigger item keeps focus
    useEffect(() => {
      const reclaimFocus = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;

        // Focus within the menu is handled by the capture handler
        if (!target || menuRef.current?.contains(target)) {
          return;
        }

        // Never steal focus from another text field
        if (target.closest('input, textarea')) {
          return;
        }

        // Only reclaim from menu elements (e.g. the submenu's
        // trigger item), leaving app-level focus moves untouched
        if (target.closest('[role="menu"], [role="menuitem"]')) {
          inputRef.current?.focus({ preventScroll: true });
        }
      };

      document.addEventListener('focusin', reclaimFocus);

      return () => {
        document.removeEventListener('focusin', reclaimFocus);
      };
    }, []);

    // Reclaim focus whenever it lands on another element within
    // the menu, so typing always goes to the search input (e.g.
    // submenu popups focused by the menu's focus management)
    const handleFocusCapture = useCallback((event: React.FocusEvent) => {
      if (event.target !== inputRef.current) {
        inputRef.current?.focus({ preventScroll: true });
      }
    }, []);

    // Focus the search input when the pointer enters the menu, as
    // hover-opened submenus keep focus on their trigger item
    const handleMouseEnter = useCallback(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, []);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        menuRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Register a menu item with the search context
    const register = useCallback(
      (id: string, registration: MenuSearchRegistration) => {
        registryRef.current.set(id, registration);
        setOrderedIds((previous) => [...previous, id]);
      },
      [],
    );

    // Unregister a menu item by ID
    const unregister = useCallback((id: string) => {
      registryRef.current.delete(id);
      setOrderedIds((previous) => previous.filter((item) => item !== id));
    }, []);

    // Close the menu by dispatching an Escape key event
    const closeMenu = useCallback(() => {
      menuRef.current?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
    }, []);

    // Handle item activation
    function handleSelectItem(index: number, shiftKey?: boolean) {
      const id = activeIds[index];

      if (!id) {
        return;
      }

      const registration = registryRef.current.get(id);

      if (!registration) {
        return;
      }

      // Shift-activation triggers the item's secondary action and
      // keeps the menu open
      if (shiftKey && registration.propsRef.current.secondaryOnSelect) {
        registration.propsRef.current.secondaryOnSelect();

        return;
      }

      // Call the item's onSelect handler
      registration.propsRef.current.onSelect?.();

      // Close the menu
      closeMenu();
    }

    // Look up navigation props for an item by its registered ID
    const getItemNavProps = useCallback(
      (id: string) => {
        const index = activeIds.indexOf(id);

        if (index === -1) {
          return null;
        }

        return getItemProps(index);
      },
      [activeIds, getItemProps],
    );

    const contextValue = useMemo<MenuSearchContextValue>(
      () => ({ register, unregister, getItemNavProps }),
      [register, unregister, getItemNavProps],
    );

    // Wrap an item list in a capped height scroll area when
    // the menu is scrollable
    function renderList(list: React.ReactElement) {
      // Non-scrollable menus render the list as is
      if (!scrollable) {
        return list;
      }

      return (
        <VerticalScrollArea className="searchable-menu-scrollable-list">
          {list}
        </VerticalScrollArea>
      );
    }

    // Compose input keyboard handling
    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      // Let the navigable list hook handle its keys first
      getInputProps().onKeyDown(event);

      // Let Escape propagate so it can close the menu
      if (event.key === 'Escape') {
        return;
      }

      // Stop all other keys from propagating to prevent Base UI
      // from handling them (e.g. typeahead)
      event.stopPropagation();
    }

    return (
      <div
        ref={setRefs}
        role="menu"
        className={propsToClass('menu searchable-menu', { className })}
        onFocusCapture={handleFocusCapture}
        onMouseEnter={handleMouseEnter}
        {...other}
      >
        {/* Search input */}
        <div role="none" className="searchable-menu-search-input">
          <TextInput
            ref={inputRef}
            variant={searchVariant}
            size="md"
            value={searchTerm}
            onValueChange={setSearchTerm}
            onKeyDown={handleInputKeyDown}
            placeholder={searchPlaceholder}
            stringPlaceholder={stringSearchPlaceholder}
            unassisted
            leading={<Icon name="search" size={14} />}
          />
        </div>

        {/* Children - hidden when rendering from registry */}
        <MenuSearchContextProvider value={contextValue}>
          {renderList(
            <div hidden={renderFromRegistry || undefined}>{children}</div>,
          )}
        </MenuSearchContextProvider>

        {/* Registry-rendered items (search results or virtualized) */}
        {renderFromRegistry &&
          (virtualized ? (
            <SearchableMenuVirtualizedList
              activeIds={activeIds}
              registry={registryRef.current}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          ) : (
            renderList(
              <div className="searchable-menu-results">
                {activeIds.map((id, index) => {
                  const registration = registryRef.current.get(id);

                  if (!registration) {
                    return null;
                  }

                  const itemNavProps = getItemProps(index);
                  const props = registration.propsRef.current;

                  return (
                    <MenuItem
                      key={id}
                      ref={itemNavProps.ref}
                      onMouseMove={itemNavProps.onMouseMove}
                      onMouseLeave={itemNavProps.onMouseLeave}
                      onClick={itemNavProps.onClick}
                      label={props.label}
                      stringLabel={props.stringLabel}
                      description={props.description}
                      stringDescription={props.stringDescription}
                      icon={props.icon}
                      contentIcon={props.contentIcon}
                      active={itemNavProps.highlighted}
                    />
                  );
                })}
              </div>,
            )
          ))}

        {/* Empty state shown when no items are listed */}
        {emptyText && activeIds.length === 0 && (
          <div className="searchable-menu-empty">{emptyText}</div>
        )}
      </div>
    );
  },
);

SearchableMenu.displayName = 'SearchableMenu';

/**
 * Resolves a searchable text value from menu item props.
 * Checks textValue, stringLabel, then translates label.
 */
function resolveTextValue(props: ActionMenuItemProps): string {
  if (props.textValue) {
    return props.textValue;
  }

  if (props.stringLabel) {
    return props.stringLabel;
  }

  if (typeof props.label === 'string') {
    return i18n.t(props.label);
  }

  return '';
}
