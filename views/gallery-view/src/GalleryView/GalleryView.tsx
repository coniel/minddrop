import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { DatabaseEntryRenderer } from '@minddrop/feature-database-entries';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps } from '@minddrop/views';
import { GAP_SIZE, defaultGalleryViewOptions } from '../constants';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryView.css';

// Estimated height of a gallery card for the virtualizer
const ESTIMATED_ROW_HEIGHT = 260;

export const GalleryViewComponent: React.FC<
  ViewTypeComponentProps<GalleryViewOptions>
> = ({ view, entries }) => {
  const maxColumns = useMemo(
    () => view.options?.maxColumns || defaultGalleryViewOptions.maxColumns,
    [view.options],
  );
  const minColumnWidth = useMemo(
    () =>
      view.options?.minColumnWidth || defaultGalleryViewOptions.minColumnWidth,
    [view.options],
  );

  // Resolve the gap option to a CSS value
  const gap: GalleryGap = view.options?.gap || defaultGalleryViewOptions.gap;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [viewWidth, setViewWidth] = useState(0);

  // Calculate how many columns fit
  const columnCount = useMemo(
    () => calculateColumnCount(maxColumns, viewWidth, minColumnWidth),
    [maxColumns, viewWidth, minColumnWidth],
  );

  // Group entries into rows of `columnCount` items each
  const rows = useMemo(
    () => splitIntoRows(entries, columnCount),
    [entries, columnCount],
  );

  // Set up virtualizer for rows
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      scrollAreaRef.current?.querySelector<HTMLElement>(
        '.scroll-area-viewport',
      ) ?? null,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    measureElement: (element) =>
      element?.getBoundingClientRect().height ?? ESTIMATED_ROW_HEIGHT,
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom =
    totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0);

  // Track container width for responsive column count
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setViewWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Don't render content until the container width is known,
  // otherwise the column count defaults to 1 causing a flash.
  const ready = viewWidth > 0;

  return (
    <div
      ref={containerRef}
      className="gallery-view"
      style={{ '--gallery-gap': GAP_SIZE[gap] } as React.CSSProperties}
    >
      {ready && (
        <ScrollArea className="gallery-view-scroll" ref={scrollAreaRef}>
          <div className="gallery-view-content">
            {/* Top spacer for virtualised items above the viewport */}
            <div style={{ height: `${paddingTop}px` }} aria-hidden="true" />

            {/* Render only the visible rows */}
            {virtualItems.map((virtualItem) => {
              const row = rows[virtualItem.index];

              return (
                <GalleryRow
                  key={virtualItem.index}
                  ref={virtualizer.measureElement}
                  virtualIndex={virtualItem.index}
                  entries={row}
                  columnCount={columnCount}
                />
              );
            })}

            {/* Bottom spacer for virtualised items below the viewport */}
            <div style={{ height: `${paddingBottom}px` }} aria-hidden="true" />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface GalleryRowProps {
  /**
   * The virtualizer index used for element measurement.
   */
  virtualIndex: number;

  /**
   * The entry IDs to render in this row.
   */
  entries: string[];

  /**
   * The total number of columns in the grid.
   */
  columnCount: number;
}

const GalleryRow = React.memo(
  React.forwardRef<HTMLDivElement, GalleryRowProps>(
    ({ virtualIndex, entries, columnCount }, ref) => {
      return (
        <div
          className="gallery-row"
          ref={ref}
          data-index={virtualIndex}
          style={
            {
              '--gallery-column-count': columnCount,
            } as React.CSSProperties
          }
        >
          {entries.map((entryId) => (
            <DatabaseEntryRenderer
              key={entryId}
              entryId={entryId}
              designType="card"
            />
          ))}
        </div>
      );
    },
  ),
);

GalleryRow.displayName = 'GalleryRow';

function calculateColumnCount(
  maxColumns: number,
  viewWidth: number,
  minColumnWidth: number,
) {
  return Math.max(
    1,
    Math.min(maxColumns, Math.floor(viewWidth / minColumnWidth)),
  );
}

/**
 * Splits an array of entry IDs into rows of `columnCount` items each.
 */
function splitIntoRows(entries: string[], columnCount: number): string[][] {
  if (columnCount <= 0) {
    return [];
  }

  const rows: string[][] = [];

  for (let i = 0; i < entries.length; i += columnCount) {
    rows.push(entries.slice(i, i + columnCount));
  }

  return rows;
}
