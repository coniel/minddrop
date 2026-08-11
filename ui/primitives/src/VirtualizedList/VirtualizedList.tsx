import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { ScrollAreaVisibility, VerticalScrollArea } from '../ScrollArea';
import './VirtualizedList.css';

/* --- VirtualizedList ---
   Renders only the rows within the scroll viewport, positioning
   them inside a full height placeholder. */

/** Rows rendered beyond the visible range by default */
const DEFAULT_OVERSCAN = 20;

export type VirtualizerInstance = ReturnType<
  typeof useVirtualizer<HTMLElement, Element>
>;

export interface VirtualizedListProps<TItem> {
  /**
   * The items to render.
   */
  items: TItem[];

  /**
   * Renders the row content for a single item.
   */
  renderItem: (item: TItem, index: number) => React.ReactNode;

  /**
   * Fixed row height, or the height of the item at the given
   * index, in pixels. Acts as an estimate when `measure` is
   * enabled.
   */
  itemHeight: number | ((item: TItem, index: number) => number);

  /**
   * Returns the row's key. Defaults to the item index.
   */
  itemKey?: (item: TItem, index: number) => string;

  /**
   * Rows rendered beyond the visible range.
   * @default 20
   */
  overscan?: number;

  /**
   * Measures rendered rows rather than relying on `itemHeight`
   * alone, supporting rows of varying height.
   * @default false
   */
  measure?: boolean;

  /**
   * Whether the virtualizer is active. Set to false while the
   * list is hidden (e.g. a closed popup) to avoid measuring it.
   * @default true
   */
  enabled?: boolean;

  /**
   * Index of the row kept scrolled into view, e.g. the
   * keyboard highlighted row. Negative values are ignored.
   */
  scrollToIndex?: number;

  /**
   * Ref to the virtualizer instance, for imperative control
   * such as scrolling to a row outside of render.
   */
  virtualizerRef?: React.Ref<VirtualizerInstance | null>;

  /**
   * When to show the scrollbar.
   * @default 'scroll'
   */
  visibility?: ScrollAreaVisibility;

  /**
   * Records and restores the scroll position under this key.
   * Omit to opt out.
   */
  stateKey?: string;

  /**
   * Applied to the scroll area root. Cap the list height from
   * here by setting a max-height on the nested
   * `.scroll-area-viewport`: the root sizes to its content, so
   * a root level max-height clips without scrolling.
   */
  className?: string;

  /**
   * Applied to the scroll area root, e.g. to give the list a
   * fixed height.
   */
  style?: React.CSSProperties;
}

/**
 * Renders a vertically scrollable list of items, mounting only
 * the rows within the viewport.
 */
export const VirtualizedList = <TItem,>({
  items,
  renderItem,
  itemHeight,
  itemKey,
  overscan = DEFAULT_OVERSCAN,
  measure = false,
  enabled = true,
  scrollToIndex,
  virtualizerRef,
  visibility = 'scroll',
  stateKey,
  className,
  style,
}: VirtualizedListProps<TItem>): React.ReactNode => {
  // The scroll area hosting the rows
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Renders only the rows visible in the scroll viewport
  const virtualizer = useVirtualizer({
    enabled,
    count: items.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: (index) => getItemHeight(items, itemHeight, index),
    getItemKey: itemKey ? (index) => itemKey(items[index], index) : undefined,
    overscan,
  });

  // Expose the virtualizer for imperative scrolling
  useImperativeHandle(virtualizerRef, () => virtualizer, [virtualizer]);

  // Keep the requested row scrolled into view
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0) {
      virtualizer.scrollToIndex(scrollToIndex, { align: 'auto' });
    }
  }, [scrollToIndex, virtualizer]);

  // Nothing to render without items
  if (!items.length) {
    return null;
  }

  return (
    <VerticalScrollArea
      ref={scrollAreaRef}
      visibility={visibility}
      stateKey={stateKey}
      className={className}
      style={style}
    >
      {/* Placeholder spanning the full list height, rows
          position within it */}
      <div
        role="presentation"
        className="virtualized-list-placeholder"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="virtualized-list-item"
            data-index={virtualItem.index}
            ref={measure ? virtualizer.measureElement : undefined}
            aria-setsize={items.length}
            aria-posinset={virtualItem.index + 1}
            style={{
              height: measure ? undefined : virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </VerticalScrollArea>
  );
};

/**
 * Returns the height of the item at the given index in pixels.
 */
function getItemHeight<TItem>(
  items: TItem[],
  itemHeight: number | ((item: TItem, index: number) => number),
  index: number,
): number {
  // Fixed height rows
  if (typeof itemHeight === 'number') {
    return itemHeight;
  }

  return itemHeight(items[index], index);
}
