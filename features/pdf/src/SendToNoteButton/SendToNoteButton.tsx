import { Events } from '@minddrop/events';
import { PdfAnnotations } from '@minddrop/pdf';
import { PdfTextSelection } from '@minddrop/ui-pdf';
import { ToolbarIconButton } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';

export interface SendToNoteButtonProps {
  /**
   * The absolute path of the PDF file.
   */
  path: string;

  /**
   * The text selection to send.
   */
  selection: PdfTextSelection;
}

/**
 * Renders the action sending a text selection to the pane's markdown
 * editor.
 */
export const SendToNoteButton: React.FC<SendToNoteButtonProps> = ({
  path,
  selection,
}) => {
  // Get the view pane the PDF renders in
  const pane = Views.useViewPane();

  // Highlights the selection and requests a quote of the highlight
  function handleSend() {
    if (!pane) {
      return;
    }

    // Highlight the selection
    const annotation = PdfAnnotations.create(path, {
      page: selection.page,
      rects: selection.rects,
      text: selection.text,
      color: PdfAnnotations.constants.DefaultColor,
    });

    // Request a quote of the highlight in the pane's editor
    Events.dispatch(PdfAnnotations.events.QuoteRequested, {
      path,
      annotation,
      viewAreaId: pane.viewAreaId,
      sourcePane: pane.pane,
    });

    // Clear the selection. The highlight takes its place.
    window.getSelection()?.removeAllRanges();
  }

  return (
    <ToolbarIconButton
      icon="notebook-pen"
      size="sm"
      label="pdf.sendToNote.label"
      disabled={!pane}
      tooltip={{ title: 'pdf.sendToNote.label' }}
      onClick={handleSend}
    />
  );
};
