import { PdfPageRect } from '../types';

export interface PdfPageSlotProps {
  /**
   * The page's number, 1-based.
   */
  pageNumber: number;

  /**
   * Where the page sits in the document column.
   */
  rect: PdfPageRect;

  /**
   * The rendered page, omitted while the page is out of view.
   */
  children?: React.ReactNode;
}

/**
 * Renders the slot a page occupies in the document column.
 */
export const PdfPageSlot: React.FC<PdfPageSlotProps> = ({
  pageNumber,
  rect,
  children,
}) => (
  <div
    className="pdf-document-page"
    data-page-number={pageNumber}
    style={
      {
        '--pdf-document-page-top': `${rect.top}px`,
        '--pdf-document-page-width': `${rect.width}px`,
        '--pdf-document-page-height': `${rect.height}px`,
      } as React.CSSProperties
    }
  >
    {children}
  </div>
);
