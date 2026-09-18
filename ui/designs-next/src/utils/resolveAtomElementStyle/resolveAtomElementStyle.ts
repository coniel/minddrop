import { DesignElement, Designs, LayoutAtomBox } from '@minddrop/designs-next';
import { formatUnitLength } from '../formatUnitLength';

/**
 * Resolves the styles positioning an element inside its atomic box:
 * its columns as lengths of the box's width, so that fluid columns
 * follow the box and fixed ones keep their unit width, and its rows
 * at their unit height from the box's top.
 *
 * @param element - The element to position.
 * @param atom - The atomic box holding it.
 * @returns The element wrapper's positioning styles.
 */
export function resolveAtomElementStyle(
  element: DesignElement,
  atom: LayoutAtomBox,
): React.CSSProperties {
  // Resolve the element's columns within the box
  const columns = Designs.resolveElementColumnUnits(
    element,
    atom.elements,
    atom,
  );

  return {
    left: formatUnitLength(columns.before, columns.total),
    width: formatUnitLength(columns.span, columns.total),
    top: (element.row - atom.row) * Designs.constants.UnitPixelSize,
    height: element.rowSpan * Designs.constants.UnitPixelSize,
  };
}
