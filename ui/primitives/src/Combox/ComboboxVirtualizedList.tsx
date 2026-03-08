import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef } from 'react';
import { VerticalScrollArea } from '../ScrollArea';
import { ComboboxOption } from './Combobox';
import { ComboboxItem } from './ComboboxItem';

/* --- ComboboxVirtualizedList ---
   Renders combobox items using @tanstack/react-virtual for
   efficient rendering of large lists. Automatically used by the
   Combobox wrapper when the item count exceeds the threshold. */

/** Item height estimate in pixels */
const ITEM_HEIGHT = 32;

/** Overscan count for smoother scrolling */
const OVERSCAN = 20;

export interface ComboboxVirtualizedListProps {
  /**
   * Whether the combobox popup is open. Controls virtualizer
   * activation to avoid measuring when hidden.
   */
  open: boolean;

  /**
   * Ref to the virtualizer instance, used by the root's
   * onItemHighlighted handler for scroll-to-index.
   */
  virtualizerRef: React.RefObject<VirtualizerInstance | null>;
}

export type VirtualizerInstance = ReturnType<
  typeof useVirtualizer<HTMLElement, Element>
>;

/** Virtualized item list for large combobox datasets. */
export const ComboboxVirtualizedList: React.FC<
  ComboboxVirtualizedListProps
> = ({ open, virtualizerRef }) => {
  const filteredItems = ComboboxPrimitive.useFilteredItems<ComboboxOption>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    enabled: open,
    count: filteredItems.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: () => ITEM_HEIGHT,
    overscan: OVERSCAN,
  });

  React.useImperativeHandle(virtualizerRef, () => virtualizer);

  const totalSize = virtualizer.getTotalSize();

  if (!filteredItems.length) {
    return null;
  }

  return (
    <VerticalScrollArea
      ref={scrollAreaRef}
      visibility="scroll"
      className="combobox-list-scroll-area"
    >
      <div
        role="presentation"
        className="combobox-virtualized-placeholder"
        style={{ height: totalSize }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = filteredItems[virtualItem.index];

          if (!item) {
            return null;
          }

          return (
            <ComboboxItem
              key={virtualItem.key}
              index={virtualItem.index}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              value={item}
              label={item.label}
              icon={item.icon}
              contentIcon={item.contentIcon}
              aria-setsize={filteredItems.length}
              aria-posinset={virtualItem.index + 1}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            />
          );
        })}
      </div>
    </VerticalScrollArea>
  );
};
