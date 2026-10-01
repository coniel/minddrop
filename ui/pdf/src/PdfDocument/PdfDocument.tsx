import { PageViewport } from 'pdfjs-dist';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pdf, PdfAnnotationColor, PdfZoom } from '@minddrop/pdf';
import { ScrollArea, Text, joinClasses } from '@minddrop/ui-primitives';
import {
  resolveRectsBounds,
  rotateSize,
  useSettledSelection,
} from '@minddrop/utils';
import { NoHighlights, PagePadding, PixelsPerPoint } from '../constants';
import {
  PdfHighlight,
  PdfPageRange,
  PdfPageSize,
  PdfTextSelection,
} from '../types';
import { usePdfDocument } from '../usePdfDocument';
import {
  resolveClientRects,
  resolveHighlightAnchor,
  resolvePageLayout,
  resolveRenderedPageRange,
  resolveTextSelection,
  resolveVisiblePage,
  resolveZoomScale,
} from '../utils';
import { PdfAnnotationToolbar } from './PdfAnnotationToolbar';
import { PdfPage } from './PdfPage';
import { PdfPageSlot } from './PdfPageSlot';
import './PdfDocument.css';

export interface PdfDocumentHandle {
  /**
   * Scrolls the document to the top of the given page.
   *
   * @param page - The page number, 1-based.
   */
  scrollToPage: (page: number) => void;

  /**
   * Scrolls the document to bring a highlight into view.
   *
   * @param highlight - The highlight to scroll to.
   */
  scrollToHighlight: (highlight: PdfHighlight) => void;
}

export interface PdfDocumentProps {
  /**
   * The URL the document is served at.
   */
  src: string;

  /**
   * The zoom the pages render at. Defaults to filling the width.
   */
  zoom?: PdfZoom;

  /**
   * The rotation the pages render at, in degrees.
   */
  rotation?: number;

  /**
   * The highlights drawn over the pages.
   */
  highlights?: PdfHighlight[];

  /**
   * The ID of the selected highlight, drawn emphasised with its
   * toolbar shown.
   */
  selectedHighlightId?: string | null;

  /**
   * Further actions offered in the toolbar under a text selection.
   */
  selectionActions?: React.ReactNode;

  /**
   * Called once the document loads.
   */
  onDocumentLoad?: (document: { pageCount: number }) => void;

  /**
   * Called when the document fails to load.
   */
  onError?: (error: Error) => void;

  /**
   * Called with the page number the viewer is on when it changes.
   */
  onVisiblePageChange?: (page: number) => void;

  /**
   * Called with the zoom the pages render at, as a multiple of their
   * physical size, whenever it changes. Resolves the fit modes to
   * the multiple they land on.
   */
  onZoomResolve?: (zoom: number) => void;

  /**
   * Called with the text selection within a page as it changes, and
   * with null when there is none or it spans pages.
   */
  onSelectionChange?: (selection: PdfTextSelection | null) => void;

  /**
   * Called with the text selection and the colour picked for it.
   * Omitted to offer no highlighting of selections.
   */
  onHighlight?: (
    selection: PdfTextSelection,
    color: PdfAnnotationColor,
  ) => void;

  /**
   * Called with the ID of the highlight a click selects, or null
   * for a click selecting none.
   */
  onHighlightSelect?: (id: string | null) => void;

  /**
   * Called with a highlight's ID and the colour picked for it.
   */
  onHighlightRecolor?: (id: string, color: PdfAnnotationColor) => void;

  /**
   * Called with the ID of the highlight to delete. Omitted to offer
   * no deletion.
   */
  onHighlightDelete?: (id: string) => void;

  /**
   * Class name applied to the scrolling element.
   */
  className?: string;
}

interface ViewportSize {
  /**
   * The viewport's width, in CSS pixels.
   */
  width: number;

  /**
   * The viewport's height, in CSS pixels.
   */
  height: number;
}

/**
 * Renders a PDF document as a scrolling column of pages.
 */
export const PdfDocument = React.forwardRef<
  PdfDocumentHandle,
  PdfDocumentProps
>(
  (
    {
      src,
      zoom = Pdf.constants.DefaultZoom,
      rotation = 0,
      highlights = NoHighlights,
      selectedHighlightId,
      selectionActions,
      onDocumentLoad,
      onError,
      onVisiblePageChange,
      onZoomResolve,
      onSelectionChange,
      onHighlight,
      onHighlightSelect,
      onHighlightRecolor,
      onHighlightDelete,
      className,
    },
    ref,
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const pagesRef = useRef<HTMLDivElement>(null);
    // The scale the pages were last laid out at, for anchoring the
    // scroll position across zoom changes.
    const previousScaleRef = useRef(0);
    // The viewport each rendered page renders through, keyed by
    // page number.
    const pageViewportsRef = useRef<Record<number, PageViewport>>({});
    // A highlight to scroll to once its page reports its viewport
    const pendingHighlightRef = useRef<PdfHighlight | null>(null);
    const [viewportSize, setViewportSize] = useState<ViewportSize>({
      width: 0,
      height: 0,
    });
    const [pageSizes, setPageSizes] = useState<Record<number, PdfPageSize>>({});
    // The pages rendered, empty until the layout is known
    const [renderedRange, setRenderedRange] = useState<PdfPageRange>({
      first: 1,
      last: 0,
    });
    // The page the viewer is on
    const [visiblePage, setVisiblePage] = useState(1);

    // Group the highlights by page index
    const pageHighlights = useMemo(() => {
      // The highlights met so far, by page
      const byPage: Record<number, PdfHighlight[]> = {};

      // Add each highlight to its page
      highlights.forEach((highlight) => {
        (byPage[highlight.page] ??= []).push(highlight);
      });

      return byPage;
    }, [highlights]);

    // Load the document
    const { document, pageCount, pageSize, error } = usePdfDocument(src);
    // Resolve a DOM selection to a selection within a page
    const resolveSelection = useCallback(
      (domSelection: Selection | null) =>
        resolveTextSelection(
          domSelection,
          pagesRef.current,
          pageViewportsRef.current,
        ),
      [],
    );
    // Track the text selection within the pages
    const selection = useSettledSelection(resolveSelection);

    // Resolve the size of every page in points. Pages which have not
    // reported their own take the first page's.
    const sizes = useMemo(
      () =>
        pageSize
          ? Array.from(
              { length: pageCount },
              (_, index) => pageSizes[index + 1] ?? pageSize,
            )
          : [],
      [pageCount, pageSize, pageSizes],
    );

    // Rotate the sizes as the pages render
    const rotatedSizes = useMemo(
      () => sizes.map((size) => rotateSize(size, rotation)),
      [sizes, rotation],
    );

    // Resolve the scale the pages render at, fitting the first page
    const scale = useMemo(
      () =>
        rotatedSizes.length
          ? resolveZoomScale(
              zoom,
              rotatedSizes[0],
              viewportSize.width,
              viewportSize.height,
            )
          : 0,
      [rotatedSizes, zoom, viewportSize],
    );

    // Lay the pages out at the scale
    const layout = useMemo(
      () => resolvePageLayout(rotatedSizes, scale),
      [rotatedSizes, scale],
    );

    // Find the selected highlight
    const selectedHighlight = selectedHighlightId
      ? highlights.find((highlight) => highlight.id === selectedHighlightId)
      : undefined;
    // Resolve the box its toolbar floats under
    const selectedAnchor = selectedHighlight
      ? resolveHighlightAnchor(
          selectedHighlight,
          pagesRef.current,
          pageViewportsRef.current,
        )
      : null;

    // Track the viewport's size. The fit modes scale to it.
    useEffect(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      // Record the viewport's size as it changes
      const observer = new ResizeObserver(([entry]) => {
        setViewportSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });

      // Watch the viewport
      observer.observe(viewport);

      // Stop watching on unmount
      return () => observer.disconnect();
    }, []);

    // Track the pages to render and the page the viewer is on, once
    // per scrolled frame at most and again when the layout changes.
    // Only these are stored, so a scroll re-renders the document only
    // when one of them changes.
    useEffect(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      // The viewport's height
      const viewportHeight = viewportSize.height;
      // The frame the next update runs in
      let frame = 0;

      // Resolve the pages to render and the visible page for the
      // scroll position.
      function update() {
        // Read the viewport's scroll position
        const scrollTop = viewport!.scrollTop;

        // Store the pages to render
        setRenderedRange((previous) =>
          resolveRenderedPageRange(layout, scrollTop, viewportHeight, previous),
        );

        // Store the page the viewer is on
        setVisiblePage(resolveVisiblePage(layout, scrollTop, viewportHeight));
      }

      // Update on the next frame
      const handleScroll = () => {
        cancelAnimationFrame(frame);

        frame = requestAnimationFrame(update);
      };

      // Update for the layout
      update();

      // Listen for scrolls
      viewport.addEventListener('scroll', handleScroll, { passive: true });

      // Stop listening and drop the pending frame
      return () => {
        cancelAnimationFrame(frame);
        viewport.removeEventListener('scroll', handleScroll);
      };
    }, [layout, viewportSize.height]);

    // Keep the same point of the document under the viewport when
    // the scale changes.
    useLayoutEffect(() => {
      // The scrolling element
      const viewport = viewportRef.current;
      // The scale the pages were last laid out at
      const previousScale = previousScaleRef.current;

      // Record the scale for the next change
      previousScaleRef.current = scale;

      // Skip the first layout and unchanged scales
      if (!viewport || !previousScale || !scale || previousScale === scale) {
        return;
      }

      // Scale the scroll position with the pages
      viewport.scrollTop = viewport.scrollTop * (scale / previousScale);
    }, [scale]);

    // Announce the document once it loads
    useEffect(() => {
      if (document) {
        onDocumentLoad?.({ pageCount: document.numPages });
      }
      // The callback is read as it was when the document loaded
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document]);

    // Announce a load failure
    useEffect(() => {
      if (error) {
        onError?.(error);
      }
      // The callback is read as it was when the load failed
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    // Announce the page the viewer is on as it changes
    useEffect(() => {
      if (document) {
        onVisiblePageChange?.(visiblePage);
      }
      // The callback is read as it was when the page changed
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document, visiblePage]);

    // Announce the zoom the pages render at as it changes
    useEffect(() => {
      if (scale) {
        onZoomResolve?.(scale / PixelsPerPoint);
      }
      // The callback is read as it was when the scale changed
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale]);

    // Announce the selection as it changes. A new selection takes
    // over from the selected highlight.
    useEffect(() => {
      onSelectionChange?.(selection);

      if (selection) {
        onHighlightSelect?.(null);
      }
      // The callbacks are read as they were when the selection changed
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection]);

    // Scrolls the viewport to the top of a page
    const scrollToPage = useCallback(
      (page: number) => {
        // The scrolling element
        const viewport = viewportRef.current;
        // The page's rect in the column
        const rect = layout.pages[page - 1];

        if (!viewport || !rect) {
          return;
        }

        // Scroll to the page's top edge, less its padding
        viewport.scrollTop = rect.top - PagePadding;
      },
      [layout],
    );

    // Scrolls the viewport to a highlight, once its page's viewport
    // is known. Returns whether it did.
    const scrollToHighlightRect = useCallback(
      (highlight: PdfHighlight) => {
        // The scrolling element
        const viewport = viewportRef.current;
        // The highlight's page's rect in the column
        const rect = layout.pages[highlight.page];
        // The viewport the page renders through
        const pageViewport = pageViewportsRef.current[highlight.page + 1];

        // Check the page is rendered. If not, report no scroll.
        if (!viewport || !rect || !pageViewport) {
          return false;
        }

        // Measure the highlight's top edge within its page
        const { top } = resolveRectsBounds(
          resolveClientRects(highlight.rects, pageViewport),
        );

        // Scroll to the highlight's top edge, less the page padding
        viewport.scrollTop = rect.top + top - PagePadding;

        // Report the scroll as done
        return true;
      },
      [layout],
    );

    // Expose the scrolling handle
    useImperativeHandle(
      ref,
      () => ({
        scrollToPage,
        scrollToHighlight(highlight) {
          // Scroll to the highlight. If its page is not rendered yet,
          // scroll to the page and finish once the page reports its
          // viewport.
          if (!scrollToHighlightRect(highlight)) {
            pendingHighlightRef.current = highlight;
            scrollToPage(highlight.page + 1);
          }
        },
      }),
      [scrollToPage, scrollToHighlightRect],
    );

    // Record a page's own size once it reports it
    const handlePageSizeChange = useCallback(
      (pageNumber: number, size: PdfPageSize) => {
        setPageSizes((current) =>
          current[pageNumber]?.width === size.width &&
          current[pageNumber]?.height === size.height
            ? current
            : { ...current, [pageNumber]: size },
        );
      },
      [],
    );

    // Record the viewport a page renders through. Finish a scroll to a
    // highlight which was waiting on it.
    const handlePageViewportChange = useCallback(
      (pageNumber: number, viewport: PageViewport | null) => {
        // Record the viewport, or forget it when the page unmounts
        if (viewport) {
          pageViewportsRef.current[pageNumber] = viewport;
        } else {
          delete pageViewportsRef.current[pageNumber];
        }

        // The highlight waiting on a page's viewport
        const pending = pendingHighlightRef.current;

        // Finish the scroll once the highlight's page reports its
        // viewport.
        if (pending && pending.page + 1 === pageNumber && viewport) {
          pendingHighlightRef.current = null;
          scrollToHighlightRect(pending);
        }
      },
      [scrollToHighlightRect],
    );

    // Select the highlight a click lands on
    const handleHighlightClick = useCallback(
      (highlight: PdfHighlight | null) => {
        onHighlightSelect?.(highlight?.id ?? null);
      },
      [onHighlightSelect],
    );

    // Highlight the selection in the picked colour. The highlight takes
    // the selection's place.
    function handleSelectionColorPick(color: PdfAnnotationColor) {
      if (!selection) {
        return;
      }

      // Report the highlight
      onHighlight?.(selection, color);
      // Clear the selection
      window.getSelection()?.removeAllRanges();
    }

    // Recolour the selected highlight
    function handleSelectedColorPick(color: PdfAnnotationColor) {
      if (selectedHighlight) {
        onHighlightRecolor?.(selectedHighlight.id, color);
      }
    }

    // Delete the selected highlight
    function handleSelectedDelete() {
      if (selectedHighlight) {
        onHighlightDelete?.(selectedHighlight.id);
      }
    }

    return (
      <ScrollArea
        className={joinClasses('pdf-document', className)}
        viewportRef={viewportRef}
      >
        <div
          ref={pagesRef}
          className="pdf-document-pages"
          style={
            {
              '--pdf-document-pages-height': `${layout.height}px`,
              '--pdf-document-pages-width': `${layout.width + PagePadding * 2}px`,
            } as React.CSSProperties
          }
        >
          {/* Pages */}
          {document &&
            layout.pages.map((rect, index) => {
              // The page's number
              const pageNumber = index + 1;

              // Check whether the page is near enough the viewport to
              // render.
              const rendered =
                pageNumber >= renderedRange.first &&
                pageNumber <= renderedRange.last;

              return (
                <PdfPageSlot
                  key={pageNumber}
                  pageNumber={pageNumber}
                  rect={rect}
                >
                  {rendered && (
                    <PdfPage
                      document={document}
                      pageNumber={pageNumber}
                      scale={scale}
                      rotation={rotation}
                      highlights={pageHighlights[index]}
                      selectedHighlightId={selectedHighlightId}
                      onSizeChange={handlePageSizeChange}
                      onViewportChange={handlePageViewportChange}
                      onHighlightClick={handleHighlightClick}
                    />
                  )}
                </PdfPageSlot>
              );
            })}

          {/* Selection toolbar */}
          {selection && onHighlight && (
            <PdfAnnotationToolbar
              anchor={selection.anchor}
              onColorPick={handleSelectionColorPick}
            >
              {selectionActions}
            </PdfAnnotationToolbar>
          )}

          {/* Selected highlight toolbar */}
          {!selection && selectedHighlight && selectedAnchor && (
            <PdfAnnotationToolbar
              anchor={selectedAnchor}
              color={selectedHighlight.color}
              onColorPick={handleSelectedColorPick}
              onDelete={onHighlightDelete ? handleSelectedDelete : undefined}
            />
          )}
        </div>

        {/* Load failure */}
        {error && (
          <Text className="pdf-document-error" color="muted" text="pdf.error" />
        )}
      </ScrollArea>
    );
  },
);

PdfDocument.displayName = 'PdfDocument';
