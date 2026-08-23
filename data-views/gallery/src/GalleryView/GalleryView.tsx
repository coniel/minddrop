import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { DataViewTypeComponentProps } from '@minddrop/data-views';
import { DatabaseEntryRenderer } from '@minddrop/feature-databases';
import { ScrollArea } from '@minddrop/ui-primitives';
import { GAP_SIZE, defaultGalleryViewOptions } from '../constants';
import { GalleryGap, GalleryViewOptions } from '../types';
import './GalleryView.css';

// Number of entries to render per batch
const BATCH_SIZE = 30;

export const GalleryViewComponent: React.FC<
  DataViewTypeComponentProps<GalleryViewOptions>
> = ({ view, entries }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Track how many entries to render
  const [renderCount, setRenderCount] = useState(BATCH_SIZE);

  // The minimum width a column may take, which the column layout
  // fits as many columns as possible into
  const minColumnWidth =
    view.options?.minColumnWidth || defaultGalleryViewOptions.minColumnWidth;

  // Resolve the gap option to a CSS value
  const gap: GalleryGap = view.options?.gap || defaultGalleryViewOptions.gap;

  // Slice entries to the current render count
  const visibleEntries = useMemo(
    () => entries.slice(0, renderCount),
    [entries, renderCount],
  );

  const hasMore = renderCount < entries.length;

  // Reset render count when entries change
  useEffect(() => {
    setRenderCount(BATCH_SIZE);
  }, [entries]);

  // Load the next batch of entries
  const loadMore = useCallback(() => {
    setRenderCount((previous) =>
      Math.min(previous + BATCH_SIZE, entries.length),
    );
  }, [entries.length]);

  // Load more entries when the user scrolls near the bottom
  // of the scroll area viewport
  useEffect(() => {
    if (!hasMore) {
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
  }, [hasMore, loadMore]);

  return (
    <div
      className="gallery-view"
      style={
        {
          '--gallery-gap': GAP_SIZE[gap],
          '--gallery-min-column-width': `${minColumnWidth}px`,
        } as React.CSSProperties
      }
    >
      <ScrollArea
        className="gallery-view-scroll"
        stateKey="content"
        ref={scrollAreaRef}
      >
        <div className="gallery-view-content">
          {visibleEntries.map((entryId) => (
            <DatabaseEntryRenderer
              key={entryId}
              entryId={entryId}
              layoutContext="card"
              layoutId={view.options?.cardLayoutId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
