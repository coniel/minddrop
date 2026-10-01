import {
  PDFDocumentProxy,
  PDFPageProxy,
  PageViewport,
  TextLayer,
} from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import { releaseCanvas } from '@minddrop/utils';
import { NoHighlights } from '../constants';
import { PdfHighlight, PdfPageSize } from '../types';
import { findHighlightAtPoint, isPdfRenderCancellation } from '../utils';
import { PdfHighlightLayer } from './PdfHighlightLayer';
import './PdfPage.css';

export interface PdfPageProps {
  /**
   * The document the page belongs to.
   */
  document: PDFDocumentProxy;

  /**
   * The page's number, 1-based.
   */
  pageNumber: number;

  /**
   * The scale the page renders at, in CSS pixels per point.
   */
  scale: number;

  /**
   * The rotation the page renders at, in degrees.
   */
  rotation: number;

  /**
   * The highlights drawn over the page.
   */
  highlights?: PdfHighlight[];

  /**
   * The ID of the selected highlight, drawn emphasised.
   */
  selectedHighlightId?: string | null;

  /**
   * Called with the page's size in points once the page loads.
   */
  onSizeChange?: (pageNumber: number, size: PdfPageSize) => void;

  /**
   * Called with the viewport the page renders through whenever it
   * changes, and with null when the page unmounts.
   */
  onViewportChange?: (
    pageNumber: number,
    viewport: PageViewport | null,
  ) => void;

  /**
   * Called with the highlight under a plain click, or null for a
   * click on none. Clicks which end a text selection are not
   * reported.
   */
  onHighlightClick?: (highlight: PdfHighlight | null) => void;
}

/**
 * Renders a page of a PDF document with its highlights and a
 * selectable text layer over it.
 */
export const PdfPage: React.FC<PdfPageProps> = ({
  document,
  pageNumber,
  scale,
  rotation,
  highlights = NoHighlights,
  selectedHighlightId,
  onSizeChange,
  onViewportChange,
  onHighlightClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  // The latest callbacks. The effects read these rather than the
  // props, so a new callback does not reload or redraw the page.
  const onSizeChangeRef = useRef(onSizeChange);
  const onViewportChangeRef = useRef(onViewportChange);
  const [page, setPage] = useState<PDFPageProxy | null>(null);
  const [viewport, setViewport] = useState<PageViewport | null>(null);

  // Keep the refs on the latest callbacks
  onSizeChangeRef.current = onSizeChange;
  onViewportChangeRef.current = onViewportChange;

  // Load the page
  useEffect(() => {
    // Whether the page was replaced before it loaded
    let cancelled = false;

    // Load the page
    document.getPage(pageNumber).then((loadedPage) => {
      // Check if the effect was replaced meanwhile. If so, drop the
      // page.
      if (cancelled) {
        return;
      }

      // Record the page
      setPage(loadedPage);

      // Report the page's size in points
      const { width, height } = loadedPage.getViewport({ scale: 1 });

      onSizeChangeRef.current?.(pageNumber, { width, height });
    });

    return () => {
      // Drop the page if it loads after the effect is replaced
      cancelled = true;
    };
  }, [document, pageNumber]);

  // Draw the page and lay out its text whenever its scale or
  // rotation changes.
  useEffect(() => {
    // The elements the page draws into
    const canvas = canvasRef.current;
    const textLayerContainer = textLayerRef.current;

    if (!page || !canvas || !textLayerContainer) {
      return;
    }

    // Resolve the viewport the page renders through at the scale and
    // rotation.
    const pageViewport = page.getViewport({ scale, rotation });

    // Record the viewport and report it
    setViewport(pageViewport);
    onViewportChangeRef.current?.(pageNumber, pageViewport);

    // The device's pixel density
    const outputScale = window.devicePixelRatio || 1;

    // Create the canvas the page is drawn into off screen. pdf.js
    // draws in slices. Each slice drawn into a shown canvas makes the
    // compositor redraw the whole canvas.
    const drawingCanvas = window.document.createElement('canvas');

    // Back the drawing at the device's pixel density so the page stays
    // crisp on high density screens.
    drawingCanvas.width = Math.floor(pageViewport.width * outputScale);
    drawingCanvas.height = Math.floor(pageViewport.height * outputScale);

    // Draw the page
    const renderTask = page.render({
      canvas: drawingCanvas,
      viewport: pageViewport,
      transform:
        outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
    });

    // Copy the complete drawing onto the shown canvas. The previous
    // drawing stays shown until then.
    function showDrawing() {
      // Size the shown canvas to the drawing and copy it across
      canvas!.width = drawingCanvas.width;
      canvas!.height = drawingCanvas.height;
      canvas!.getContext('2d')?.drawImage(drawingCanvas, 0, 0);

      // Release the drawing's pixels
      releaseCanvas(drawingCanvas);
    }

    // Clear the previous text layout
    textLayerContainer.replaceChildren();

    // Lay the text out for the new viewport
    const textLayer = new TextLayer({
      textContentSource: page.streamTextContent(),
      container: textLayerContainer,
      viewport: pageViewport,
    });

    // Swallow the rejection a cancelled draw or layout ends with
    function handleRenderError(error: unknown) {
      if (!isPdfRenderCancellation(error)) {
        throw error;
      }
    }

    // Run the draw and the layout. Show the drawing once complete.
    renderTask.promise.then(showDrawing).catch(handleRenderError);
    textLayer.render().catch(handleRenderError);

    return () => {
      // Cancel the draw and the layout
      renderTask.cancel();
      textLayer.cancel();

      // Release an unfinished drawing's pixels
      releaseCanvas(drawingCanvas);
    };
  }, [page, pageNumber, scale, rotation]);

  // Release the shown canvas's pixels when the page unmounts
  useEffect(() => {
    const canvas = canvasRef.current;

    return () => {
      if (canvas) {
        releaseCanvas(canvas);
      }
    };
  }, []);

  // Report the page's viewport as gone when the page unmounts
  useEffect(
    () => () => {
      onViewportChangeRef.current?.(pageNumber, null);
    },
    [pageNumber],
  );

  // Report the highlight under a plain click
  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!onHighlightClick || !viewport) {
      return;
    }

    // Ignore a click ending a text selection. It is the selection's,
    // not a highlight's.
    if (!window.getSelection()?.isCollapsed) {
      return;
    }

    // Measure the page's box
    const pageRect = event.currentTarget.getBoundingClientRect();

    // Report the highlight under the click's position within the page
    onHighlightClick(
      findHighlightAtPoint(
        highlights,
        viewport,
        event.clientX - pageRect.left,
        event.clientY - pageRect.top,
      ),
    );
  }

  return (
    <div
      className="pdf-page"
      style={{ '--total-scale-factor': scale } as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Drawn page */}
      <canvas ref={canvasRef} className="pdf-page-canvas" />

      {/* Highlights */}
      {viewport && highlights.length > 0 && (
        <PdfHighlightLayer
          highlights={highlights}
          viewport={viewport}
          selectedId={selectedHighlightId}
        />
      )}

      {/* Selectable text */}
      <div ref={textLayerRef} className="pdf-page-text-layer" />
    </div>
  );
};
