import React from 'react';
import { MenuItem } from '../Menu/MenuItem';
import { MenuSearchRegistration } from '../Menu/MenuSearchContext';
import { VirtualizedList } from '../VirtualizedList';
import { NavigableListItemProps } from '../hooks/useNavigableList';

/* --- SearchableMenuVirtualizedList ---
   Renders searchable menu items in a virtualized list for
   efficient handling of large item counts. Used automatically
   by SearchableMenu when the item count exceeds the
   threshold. */

/** Item height estimate in pixels */
const ITEM_HEIGHT = 32;

export interface SearchableMenuVirtualizedListProps {
  /**
   * Ordered list of item IDs to render.
   */
  activeIds: string[];

  /**
   * Registry map to look up item props by ID.
   */
  registry: Map<string, MenuSearchRegistration>;

  /**
   * Currently highlighted item index from useNavigableList.
   */
  highlightedIndex: number;

  /**
   * Returns navigable list props for the item at the given index.
   */
  getItemProps: (index: number) => NavigableListItemProps;
}

/**
 * Renders searchable menu items in a virtualized list for
 * efficient handling of large item counts.
 */
export const SearchableMenuVirtualizedList: React.FC<
  SearchableMenuVirtualizedListProps
> = ({ activeIds, registry, highlightedIndex, getItemProps }) => {
  // Renders the menu item registered under the given ID
  function renderItem(id: string, index: number) {
    const registration = registry.get(id);

    // Skip IDs which have no registered item
    if (!registration) {
      return null;
    }

    const itemNavigationProps = getItemProps(index);
    const props = registration.propsRef.current;

    return (
      <MenuItem
        onMouseMove={itemNavigationProps.onMouseMove}
        onMouseLeave={itemNavigationProps.onMouseLeave}
        onClick={itemNavigationProps.onClick}
        label={props.label}
        stringLabel={props.stringLabel}
        description={props.description}
        stringDescription={props.stringDescription}
        icon={props.icon}
        contentIcon={props.contentIcon}
        active={itemNavigationProps.highlighted}
      />
    );
  }

  return (
    <VirtualizedList
      measure
      items={activeIds}
      itemHeight={ITEM_HEIGHT}
      itemKey={getItemKey}
      renderItem={renderItem}
      scrollToIndex={highlightedIndex}
      className="searchable-menu-virtualized-list"
    />
  );
};

/**
 * Returns the item ID as the row key.
 */
function getItemKey(id: string): string {
  return id;
}
