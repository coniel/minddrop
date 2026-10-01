import { resolveAnchorFragment } from '@minddrop/ast';
import { DatabaseEntries } from '@minddrop/databases';
import { InsertEditorReferenceEvent } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { PdfAnnotationQuoteRequestedEventData } from '@minddrop/pdf';

/**
 * Quotes a PDF annotation into the editor of the pane the quote was
 * requested from, as a link to the annotation in the entry holding the
 * document. Does nothing for a document no entry property holds, or a
 * request made from outside a view pane.
 *
 * @param data - The quote request.
 *
 * @dispatches editor:reference:insert
 */
export function quoteEntryPdfAnnotation(
  data: PdfAnnotationQuoteRequestedEventData,
): void {
  const { path, annotation, viewAreaId, sourcePane } = data;

  // Check the request came from a view pane
  if (!viewAreaId || !sourcePane) {
    return;
  }

  // Find the entry property holding the document
  const owner = DatabaseEntries.findPropertyFileOwner(path);

  if (!owner) {
    return;
  }

  // Quote the annotation as a link to it in the entry
  Events.dispatch(InsertEditorReferenceEvent, {
    viewAreaId,
    pane: sourcePane,
    reference: DatabaseEntries.resolveReference(owner.entryId),
    fragment: resolveAnchorFragment(annotation.id),
    label: annotation.text,
    quote: true,
  });
}
