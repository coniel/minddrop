import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useEffect, useRef } from 'react';
import { MenuItem } from '../Menu/MenuItem';
import { MenuSearchRegistration } from '../Menu/MenuSearchContext';
import { VerticalScrollArea } from '../ScrollArea';
import { NavigableListItemProps } from '../hooks/useNavigableList';

/* --- SearchableMenuVirtualizedList ---
   Renders searchable menu items using @tanstack/react-virtual for
   efficient rendering of large lists. Used automatically by
   SearchableMenu when the item count exceeds the threshold. */

/** Item height estimate in pixels */
const ITEM_HEIGHT = 32;

/** Overscan count for smoother scrolling */
const OVERSCAN = 20;

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

  /**
   * Mouse move handler for the container.
   */
  onMouseMove: React.MouseEventHandler;
}

/**
 * Renders searchable menu items in a virtualized list for
 * efficient handling of large item counts.
 */
export const SearchableMenuVirtualizedList: React.FC<
  SearchableMenuVirtualizedListProps
> = ({ activeIds, registry, highlightedIndex, getItemProps, onMouseMove }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: activeIds.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: () => ITEM_HEIGHT,
    overscan: OVERSCAN,
  });

  // Scroll the highlighted item into view on keyboard navigation
  useEffect(() => {
    if (highlightedIndex >= 0) {
      virtualizer.scrollToIndex(highlightedIndex, { align: 'auto' });
    }
  }, [highlightedIndex, virtualizer]);

  const totalSize = virtualizer.getTotalSize();

  if (!activeIds.length) {
    return null;
  }

  return (
    <VerticalScrollArea
      ref={scrollAreaRef}
      visibility="scroll"
      className="searchable-menu-virtualized-list"
    >
      <div
        role="presentation"
        className="searchable-menu-virtualized-placeholder"
        style={{ height: totalSize }}
        onMouseMove={onMouseMove}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const id = activeIds[virtualItem.index];
          const registration = registry.get(id);

          if (!registration) {
            return null;
          }

          const itemNavProps = getItemProps(virtualItem.index);
          const props = registration.propsRef.current;

          return (
            <div
              key={id}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              aria-setsize={activeIds.length}
              aria-posinset={virtualItem.index + 1}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MenuItem
                onMouseMove={itemNavProps.onMouseMove}
                onMouseLeave={itemNavProps.onMouseLeave}
                onClick={itemNavProps.onClick}
                label={props.label}
                stringLabel={props.stringLabel}
                icon={props.icon}
                contentIcon={props.contentIcon}
                active={itemNavProps.highlighted}
              />
            </div>
          );
        })}
      </div>
    </VerticalScrollArea>
  );
};
