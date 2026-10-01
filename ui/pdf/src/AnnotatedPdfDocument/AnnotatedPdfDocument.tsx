import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Fs } from '@minddrop/file-system';
import {
  PdfAnnotationColor,
  PdfAnnotationFocusRequest,
  PdfAnnotations,
} from '@minddrop/pdf';
import {
  PdfDocument,
  PdfDocumentHandle,
  PdfDocumentProps,
} from '../PdfDocument';
import { PdfHighlight, PdfTextSelection } from '../types';
import { resolveAnnotationHighlight } from '../utils';

export interface AnnotatedPdfDocumentProps
  extends Omit<
    PdfDocumentProps,
    | 'src'
    | 'highlights'
    | 'selectedHighlightId'
    | 'selectionActions'
    | 'onHighlight'
    | 'onHighlightSelect'
    | 'onHighlightRecolor'
    | 'onHighlightDelete'
  > {
  /**
   * The absolute path of the PDF file.
   */
  path: string;

  /**
   * The request to bring an annotation forward once the document
   * shows it. Each new request object brings the annotation forward
   * again. Null to bring none forward.
   */
  focusRequest?: PdfAnnotationFocusRequest | null;

  /**
   * Renders further actions offered in the toolbar under a text
   * selection.
   */
  renderSelectionActions?: (selection: PdfTextSelection) => React.ReactNode;
}

/**
 * Renders a PDF document with its annotations drawn over the pages.
 */
export const AnnotatedPdfDocument = React.forwardRef<
  PdfDocumentHandle,
  AnnotatedPdfDocumentProps
>(
  (
    {
      path,
      focusRequest,
      renderSelectionActions,
      onDocumentLoad,
      onSelectionChange,
      ...other
    },
    ref,
  ) => {
    const documentRef = useRef<PdfDocumentHandle>(null);
    // The ID of the annotation asked to be brought forward. Kept until
    // the document can show it, as the request may be withdrawn before
    // the document loads.
    const requestedIdRef = useRef<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [selection, setSelection] = useState<PdfTextSelection | null>(null);
    // The document's annotations
    const annotations = PdfAnnotations.useAll(path);

    // Map the annotations to the highlights drawn over the pages
    const highlights = useMemo<PdfHighlight[]>(
      () => annotations.map(resolveAnnotationHighlight),
      [annotations],
    );

    // Resolve the file's URL
    const src = Fs.resolveFileSrc(path);

    // Keep hold of the annotation asked for
    useEffect(() => {
      if (focusRequest) {
        requestedIdRef.current = focusRequest.annotationId;
      }
    }, [focusRequest]);

    // Bring the requested annotation forward once the document and
    // the annotations can show it, and on each new request.
    useEffect(() => {
      const requestedId = requestedIdRef.current;

      if (!loaded || !requestedId) {
        return;
      }

      // Find the requested annotation's highlight
      const highlight = highlights.find(
        (candidate) => candidate.id === requestedId,
      );

      if (!highlight) {
        return;
      }

      // Clear the request, then scroll to the highlight
      requestedIdRef.current = null;
      documentRef.current?.scrollToHighlight(highlight);
    }, [loaded, highlights, focusRequest]);

    // Pass the scrolling handle through to the document
    useImperativeHandle(ref, () => ({
      scrollToPage: (page) => documentRef.current?.scrollToPage(page),
      scrollToHighlight: (highlight) =>
        documentRef.current?.scrollToHighlight(highlight),
    }));

    // Track the selection and pass it on
    function handleSelectionChange(nextSelection: PdfTextSelection | null) {
      setSelection(nextSelection);
      onSelectionChange?.(nextSelection);
    }

    // Mark the document loaded and pass it on
    function handleDocumentLoad(document: { pageCount: number }) {
      setLoaded(true);
      onDocumentLoad?.(document);
    }

    // Create an annotation for the highlighted selection
    function handleHighlight(
      highlighted: PdfTextSelection,
      color: PdfAnnotationColor,
    ) {
      PdfAnnotations.create(path, {
        page: highlighted.page,
        rects: highlighted.rects,
        text: highlighted.text,
        color,
      });
    }

    // Recolour the annotation
    function handleRecolor(id: string, color: PdfAnnotationColor) {
      PdfAnnotations.update(path, id, { color });
    }

    // Delete the annotation, deselecting it
    function handleDelete(id: string) {
      setSelectedId(null);
      PdfAnnotations.delete(path, id);
    }

    // Check the file can be served. If not, render nothing.
    if (!src) {
      return null;
    }

    return (
      <PdfDocument
        ref={documentRef}
        src={src}
        highlights={highlights}
        selectedHighlightId={selectedId}
        selectionActions={selection && renderSelectionActions?.(selection)}
        onDocumentLoad={handleDocumentLoad}
        onSelectionChange={handleSelectionChange}
        onHighlight={handleHighlight}
        onHighlightSelect={setSelectedId}
        onHighlightRecolor={handleRecolor}
        onHighlightDelete={handleDelete}
        {...other}
      />
    );
  },
);

AnnotatedPdfDocument.displayName = 'AnnotatedPdfDocument';
