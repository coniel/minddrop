import { useEffect, useRef, useState } from 'react';
import { DesignElementProps } from '@minddrop/designs-next';
import { Pdf, PdfZoom } from '@minddrop/pdf';
import { Properties } from '@minddrop/properties';
import {
  resolveElementStyle,
  useElementProperty,
  useHasMappedMarkdownEditor,
} from '@minddrop/ui-designs-next';
import {
  AnnotatedPdfDocument,
  PdfDocumentHandle,
  PdfTextSelection,
  PdfToolbar,
} from '@minddrop/ui-pdf';
import {
  ContentIcon,
  Group,
  ToolbarIconButton,
  joinClasses,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { SendToNoteButton } from '../../../SendToNoteButton';
import { PdfElement } from '../PdfElement.types';
import './PdfElementRenderer.css';

/**
 * Renders a PDF element as its property's document in a reader.
 */
export const PdfElementRenderer: React.FC<DesignElementProps<PdfElement>> = ({
  element,
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const documentRef = useRef<PdfDocumentHandle>(null);
  const [expanded, setExpanded] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState<PdfZoom>(Pdf.constants.DefaultZoom);
  // The zoom the pages render at, as a multiple of their size. The
  // fit modes resolve to this once the document lays out.
  const [resolvedZoom, setResolvedZoom] = useState(1);
  // The element's property
  const property = useElementProperty(element);
  // Check if the design has a mapped markdown editor
  const hasMappedMarkdownEditor = useHasMappedMarkdownEditor();

  // Get the view pane the reader renders in
  const pane = Views.useViewPane();

  // Resolve the file the property has, null while it has none
  const path =
    typeof property?.value === 'string' && property.value
      ? property.value
      : null;

  // Watch the page of the document last read
  const readPage = Pdf.useReadPage(path ?? '');
  // Watch the request to bring one of the document's annotations
  // forward.
  const focusRequest = Pdf.useAnnotationFocusRequest(path ?? '');
  // Register the reader as showing the document in its view area
  Pdf.useReader(path, pane?.viewAreaId ?? null);
  // Resolve the element's style
  const style = resolveElementStyle(element);

  // Bring the reader into view when a request names one of the
  // document's annotations.
  useEffect(() => {
    if (!focusRequest) {
      return;
    }

    // Scroll the reader into view on the next frame, once the
    // document has laid out.
    const frame = requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });

    // Cancel the scroll if the request changes first
    return () => cancelAnimationFrame(frame);
  }, [focusRequest]);

  // Return to the page last read once the document loads
  function handleDocumentLoad(document: { pageCount: number }) {
    // Record the page count
    setPageCount(document.pageCount);

    // Scroll to the page last read
    if (readPage) {
      documentRef.current?.scrollToPage(readPage);
    }
  }

  // Record the page read as the reader moves through the document
  function handleVisiblePageChange(visiblePage: number) {
    // Record the page for the toolbar
    setPage(visiblePage);

    // Record the page last read unless it is the one already recorded
    if (path && visiblePage !== readPage) {
      Pdf.setReadPage(path, visiblePage);
    }
  }

  // Scroll to the picked page
  function handlePageChange(nextPage: number) {
    documentRef.current?.scrollToPage(nextPage);
  }

  // Expand or collapse the reader
  function handleToggleExpanded() {
    setExpanded((current) => !current);
  }

  // Offers sending the selection to the entry's note
  function renderSelectionActions(selection: PdfTextSelection) {
    if (!path) {
      return null;
    }

    return <SendToNoteButton path={path} selection={selection} />;
  }

  // Check the property has a file. If not, show the property's icon.
  if (!path || !property) {
    return (
      <Group
        className="design-pdf-element design-pdf-element-empty"
        justify="center"
        style={style}
      >
        <ContentIcon
          className="design-pdf-element-icon"
          icon={property?.schema.icon ?? Properties.schemas.pdf.icon}
        />
      </Group>
    );
  }

  return (
    <Group
      ref={rootRef}
      className={joinClasses(
        'design-pdf-element',
        expanded && 'design-pdf-element-expanded',
      )}
      align="stretch"
      style={expanded ? undefined : style}
    >
      {/* Reader */}
      <AnnotatedPdfDocument
        ref={documentRef}
        path={path}
        zoom={zoom}
        focusRequest={focusRequest}
        renderSelectionActions={
          hasMappedMarkdownEditor ? renderSelectionActions : undefined
        }
        onDocumentLoad={handleDocumentLoad}
        onVisiblePageChange={handleVisiblePageChange}
        onZoomResolve={setResolvedZoom}
      />

      {/* Reading toolbar */}
      <PdfToolbar
        page={page}
        pageCount={pageCount}
        zoom={zoom}
        resolvedZoom={resolvedZoom}
        visible
        onPageChange={handlePageChange}
        onZoomChange={setZoom}
      >
        {/* Expand and collapse */}
        <ToolbarIconButton
          icon={expanded ? 'minimize-2' : 'maximize-2'}
          label={expanded ? 'pdf.element.collapse' : 'pdf.element.expand'}
          size="xs"
          onClick={handleToggleExpanded}
        />
      </PdfToolbar>
    </Group>
  );
};
