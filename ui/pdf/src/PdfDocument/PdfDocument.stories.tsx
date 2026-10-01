import { useEffect, useRef, useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { Pdf, PdfAnnotationColor, PdfZoom } from '@minddrop/pdf';
import { Button, Group, Stack, Text } from '@minddrop/ui-primitives';
import { Story, StorySection } from '@minddrop/ui-primitives/dev';
import { shortId } from '@minddrop/utils';
import { PdfToolbar } from '../PdfToolbar';
import { PdfHighlight, PdfTextSelection } from '../types';
import { PdfDocument, PdfDocumentHandle } from './PdfDocument';
import './PdfDocument.stories.css';

/**
 * Renders the PDF document stories.
 */
export const PdfDocumentStories = () => (
  <Story title="PDF document">
    <StorySection
      title="Reader"
      description="Pick a PDF from your computer to open it in the reader. The file is read in place and never stored. Select text to highlight it, click a highlight to recolour or delete it, and use the toolbar to page and zoom."
    >
      <ReaderStory />
    </StorySection>
  </Story>
);

/**
 * Renders the reader over a PDF picked from the file system, with
 * highlights kept in memory.
 */
const ReaderStory = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<PdfDocumentHandle>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<PdfHighlight[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState<PdfZoom>(Pdf.constants.DefaultZoom);
  const [resolvedZoom, setResolvedZoom] = useState(1);

  // Release the picked file's URL once it is no longer shown
  useEffect(
    () => () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    },
    [src],
  );

  // Open the picked file in the reader
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    // The picked file
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Show the file, starting without highlights
    setFileName(file.name);
    setSrc(URL.createObjectURL(file));
    setHighlights([]);
    setSelectedId(null);
    setPageCount(0);
  }

  // Record the page count
  function handleDocumentLoad(document: { pageCount: number }) {
    setPageCount(document.pageCount);
  }

  // Scroll to the picked page
  function handlePageChange(nextPage: number) {
    documentRef.current?.scrollToPage(nextPage);
  }

  // Add a highlight for the selection in the picked colour
  function handleHighlight(
    selection: PdfTextSelection,
    color: PdfAnnotationColor,
  ) {
    setHighlights((current) => [
      ...current,
      { id: shortId(), page: selection.page, rects: selection.rects, color },
    ]);
  }

  // Recolour the highlight
  function handleHighlightRecolor(id: string, color: PdfAnnotationColor) {
    setHighlights((current) =>
      current.map((highlight) =>
        highlight.id === id ? { ...highlight, color } : highlight,
      ),
    );
  }

  // Remove the highlight, deselecting it
  function handleHighlightDelete(id: string) {
    setSelectedId(null);
    setHighlights((current) =>
      current.filter((highlight) => highlight.id !== id),
    );
  }

  return (
    <Stack gap={3}>
      {/* File picker */}
      <Group gap={3}>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="pdf-document-stories-input"
          onChange={handleFileChange}
        />
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          Choose a PDF
        </Button>
        <Text
          size="sm"
          color="muted"
          stringText={fileName ?? 'No file chosen'}
        />
      </Group>

      {/* Reader */}
      {src && (
        <div className="pdf-document-stories-frame floating-toolbar-host">
          <PdfDocument
            ref={documentRef}
            src={src}
            zoom={zoom}
            highlights={highlights}
            selectedHighlightId={selectedId}
            onDocumentLoad={handleDocumentLoad}
            onVisiblePageChange={setPage}
            onZoomResolve={setResolvedZoom}
            onHighlight={handleHighlight}
            onHighlightSelect={setSelectedId}
            onHighlightRecolor={handleHighlightRecolor}
            onHighlightDelete={handleHighlightDelete}
          />
          <PdfToolbar
            page={page}
            pageCount={pageCount}
            zoom={zoom}
            resolvedZoom={resolvedZoom}
            onPageChange={handlePageChange}
            onZoomChange={setZoom}
          />
        </div>
      )}
    </Stack>
  );
};

// Register the story
registerStory({
  group: 'PDF',
  label: 'PDF document',
  component: PdfDocumentStories,
});
