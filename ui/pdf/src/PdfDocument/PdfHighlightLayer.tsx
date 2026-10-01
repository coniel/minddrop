import { joinClasses } from '@minddrop/ui-primitives';
import { resolveColorLevel } from '@minddrop/ui-theme';
import { PdfHighlight, PdfViewportLike } from '../types';
import { resolveClientRects } from '../utils';
import './PdfHighlightLayer.css';

export interface PdfHighlightLayerProps {
  /**
   * The highlights on the page.
   */
  highlights: PdfHighlight[];

  /**
   * The viewport the page renders through.
   */
  viewport: PdfViewportLike;

  /**
   * The ID of the selected highlight, drawn emphasised.
   */
  selectedId?: string | null;
}

// The palette step a highlight is tinted in
const HighlightLevel = 500;
// The darker step a selected highlight is tinted in
const SelectedHighlightLevel = 600;

/**
 * Renders a page's highlights as coloured boxes over the drawn page.
 */
export const PdfHighlightLayer: React.FC<PdfHighlightLayerProps> = ({
  highlights,
  viewport,
  selectedId,
}) => (
  <div className="pdf-highlight-layer light-theme">
    {highlights.map((highlight) =>
      resolveClientRects(highlight.rects, viewport).map((rect, index) => (
        <div
          key={`${highlight.id}:${index}`}
          className={joinClasses(
            'pdf-highlight',
            highlight.id === selectedId ? 'pdf-highlight-selected' : undefined,
          )}
          data-highlight-id={highlight.id}
          style={
            {
              '--pdf-highlight-left': `${rect.left}px`,
              '--pdf-highlight-top': `${rect.top}px`,
              '--pdf-highlight-width': `${rect.width}px`,
              '--pdf-highlight-height': `${rect.height}px`,
              '--pdf-highlight-color': resolveColorLevel(
                highlight.color,
                HighlightLevel,
              ),
              '--pdf-highlight-selected-color': resolveColorLevel(
                highlight.color,
                SelectedHighlightLevel,
              ),
            } as React.CSSProperties
          }
        />
      )),
    )}
  </div>
);
