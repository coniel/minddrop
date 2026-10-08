import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { PdfElement } from './PdfElement.types';
import { PdfElementRenderer } from './PdfElementRenderer';

// The PDF element's type
export const PdfElementType = 'pdf';

// The height a new PDF element takes, in grid units
const DefaultRowSpan = 100;

/**
 * Config for the PDF element. It renders a pdf property's document
 * in a reader. Not listed on the grid palette: a reader takes a
 * page's height rather than a block's.
 */
export const PdfElementConfig: DesignElementConfig<PdfElement> = {
  type: PdfElementType,
  label: 'pdf.element.label',
  icon: 'file-text',
  propertyTypes: ['pdf'],
  suggestedPropertyTypes: ['pdf'],
  component: PdfElementRenderer,
  defaultColumnSpan: Designs.constants.TypeColumns.card,
  defaultRowSpan: DefaultRowSpan,
  // Fix the block's height, as the reader scrolls inside it
  defaultContentFit: 'fixed',
  settingControls: ['background', 'corner-radius'],
};
