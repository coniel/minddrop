import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import { ScrollArea } from '@minddrop/ui-primitives';
import { ViewTypeComponentProps } from '@minddrop/views';
import { GAP_SIZE, defaultGalleryViewOptions } from '../constants';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryView.css';

// Number of entries to render per batch
const BATCH_SIZE = 30;

// Maps gap option values to pixel sizes for column calculation
const GAP_PX: Record<GalleryGap, number> = {
  none: 0,
  compact: 8,
  comfortable: 16,
  spacious: 24,
};

export const GalleryViewComponent: React.FC<
  ViewTypeComponentProps<GalleryViewOptions>
> = ({ view, entries }) => {
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

  // Track how many entries to render
  const [renderCount, setRenderCount] = useState(BATCH_SIZE);

  // Reset render count when entries change
  useEffect(() => {
    setRenderCount(BATCH_SIZE);
  }, [entries]);

  // Calculate how many columns fit based on min width and gap
  const columnCount = useMemo(
    () => calculateColumnCount(viewWidth, minColumnWidth, GAP_PX[gap]),
    [viewWidth, minColumnWidth, gap],
  );

  // Slice entries to the current render count
  const visibleEntries = useMemo(
    () => entries.slice(0, renderCount),
    [entries, renderCount],
  );

  const hasMore = renderCount < entries.length;

  // Load the next batch of entries
  const loadMore = useCallback(() => {
    setRenderCount((previous) =>
      Math.min(previous + BATCH_SIZE, entries.length),
    );
  }, [entries.length]);

  // Don't render content until the container width is known,
  // otherwise the column count defaults to 1 causing a flash.
  const ready = viewWidth > 0;

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

  // Load more entries when the user scrolls near the bottom
  // of the scroll area viewport
  useEffect(() => {
    if (!ready || !hasMore) {
      return;
    }

    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>(
      '.scroll-area-viewport',
    );

    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;

      // Load more when within 400px of the bottom
      if (scrollHeight - scrollTop - clientHeight < 400) {
        loadMore();
      }
    };

    // Check immediately in case the content doesn't fill the
    // viewport (no scrollbar means no scroll events will fire)
    handleScroll();

    viewport.addEventListener('scroll', handleScroll, { passive: true });

    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [ready, hasMore, loadMore]);

  return (
    <div
      ref={containerRef}
      className="gallery-view"
      style={
        {
          '--gallery-gap': GAP_SIZE[gap],
          '--gallery-column-count': columnCount,
        } as React.CSSProperties
      }
    >
      {ready && (
        <ScrollArea className="gallery-view-scroll" ref={scrollAreaRef}>
          <div className="gallery-view-content">
            {visibleEntries.map((entryId) => (
              <DatabaseEntryRenderer
                key={entryId}
                entryId={entryId}
                designType="card"
                designId={view.options?.cardDesignId}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

/**
 * Calculates the maximum number of columns that fit within
 * the available width without any column going below minWidth.
 */
function calculateColumnCount(
  viewWidth: number,
  minWidth: number,
  gapPx: number,
) {
  if (viewWidth <= 0 || minWidth <= 0) {
    return 1;
  }

  // Solve: columns * minWidth + (columns - 1) * gap <= viewWidth
  // columns <= (viewWidth + gap) / (minWidth + gap)
  const columns = Math.floor((viewWidth + gapPx) / (minWidth + gapPx));

  return Math.max(1, columns);
}
