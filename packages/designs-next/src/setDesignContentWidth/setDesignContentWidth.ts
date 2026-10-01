import { ContentWidthColumns, DesignTypeColumns } from '../constants';
import { getDesign } from '../getDesign';
import { ContentWidth, Design } from '../types';
import { updateDesign } from '../updateDesign';
import { remapElementColumns } from '../utils';

/**
 * Sets the reading width a design caps its content at, remapping its
 * elements to the cap's columns. Null returns the design to full
 * width at its type's columns. The design is written to the file
 * system unless it is owned.
 *
 * @param id - The ID of the design to set the content width of.
 * @param contentWidth - The content width, or null for full width.
 * @returns The updated design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 *
 * @dispatches designs-next:design:updated
 */
export async function setDesignContentWidth(
  id: string,
  contentWidth: ContentWidth | null,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Resolve the new columns, the cap's width or the type's for full
  // width.
  const columns = contentWidth
    ? ContentWidthColumns[contentWidth]
    : DesignTypeColumns[design.type];

  // Remap the elements to the new columns
  const elements = remapElementColumns(
    design.elements,
    design.columns,
    columns,
  );

  // Update the design
  return updateDesign(id, { columns, elements, contentWidth });
}
