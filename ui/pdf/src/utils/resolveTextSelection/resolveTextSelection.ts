import {
  collapseWhitespace,
  resolveClosestElement,
  resolveRelativeRect,
} from '@minddrop/utils';
import { PageSelector, PageSlotSelector } from '../../constants';
import { PdfTextSelection, PdfViewportLike } from '../../types';
import { resolvePdfRects } from '../resolvePdfRects';

/**
 * Resolves a DOM selection to a text selection within one of a
 * document's pages.
 *
 * @param domSelection - The DOM selection, or null for none.
 * @param pagesElement - The element the pages are laid out in, or null while unmounted.
 * @param pageViewports - The viewport each rendered page renders through, keyed by page number.
 * @returns The text selection, or null when there is none, it spans pages, or it lies outside the document.
 */
export function resolveTextSelection(
  domSelection: Selection | null,
  pagesElement: HTMLDivElement | null,
  pageViewports: Record<number, PdfViewportLike>,
): PdfTextSelection | null {
  // Check the selection has a range. Without one there is nothing to
  // resolve.
  if (
    !pagesElement ||
    !domSelection ||
    domSelection.isCollapsed ||
    domSelection.rangeCount === 0
  ) {
    return null;
  }

  // The page slots the selection starts and ends in
  const anchorSlot = resolveClosestElement(
    domSelection.anchorNode,
    PageSlotSelector,
  );
  const focusSlot = resolveClosestElement(
    domSelection.focusNode,
    PageSlotSelector,
  );

  // Check the selection stays within one page of the document.
  // Otherwise it is not a page selection.
  if (
    !anchorSlot ||
    anchorSlot !== focusSlot ||
    !pagesElement.contains(anchorSlot)
  ) {
    return null;
  }

  // The page the selection is on, as rendered
  const pageNumber = Number(anchorSlot.dataset.pageNumber);
  const viewport = pageViewports[pageNumber];
  const pageElement = anchorSlot.querySelector(PageSelector);

  // Check the page is rendered. Otherwise there is no viewport to
  // resolve through.
  if (!viewport || !pageElement) {
    return null;
  }

  // The selection's range
  const range = domSelection.getRangeAt(0);
  // Resolve the selected rects into PDF user space
  const rects = resolvePdfRects(
    Array.from(range.getClientRects()),
    pageElement.getBoundingClientRect(),
    viewport,
  );

  // Check any text was selected. Otherwise there is no selection.
  if (rects.length === 0) {
    return null;
  }

  // Build the selection
  return {
    // The page as a 0-based index
    page: pageNumber - 1,
    // The selected rects
    rects,
    // The selected text, with its whitespace collapsed
    text: collapseWhitespace(domSelection.toString()),
    // The bounding box relative to the document column
    anchor: resolveRelativeRect(
      range.getBoundingClientRect(),
      pagesElement.getBoundingClientRect(),
    ),
  };
}
