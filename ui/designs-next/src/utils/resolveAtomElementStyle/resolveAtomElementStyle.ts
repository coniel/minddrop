import { DesignElement, Designs, LayoutAtomBox } from '@minddrop/designs-next';
import { formatUnitLength } from '../formatUnitLength';

/**
 * Resolves the styles positioning an element inside its atomic box:
 * its columns and rows as lengths of the box's width and height, so
 * that fluid columns follow the box, fixed ones keep their unit
 * width, and a pinned element holds its edge of the box when the
 * box is taller than its rows.
 *
 * @param element - The element to position.
 * @param atom - The atomic box holding it.
 * @returns The element wrapper's positioning styles.
 */
export function resolveAtomElementStyle(
  element: DesignElement,
  atom: LayoutAtomBox,
): React.CSSProperties {
  // Resolve the element's columns and rows within the box
  const columns = Designs.resolveElementColumnUnits(
    element,
    atom.elements,
    atom,
  );
  const rows = Designs.resolveElementRowUnits(element, atom.elements, atom);

  return {
    left: formatUnitLength(columns.before, columns.total),
    width: formatUnitLength(columns.span, columns.total),
    top: formatUnitLength(rows.before, rows.total),
    height: formatUnitLength(rows.span, rows.total),
  };
}
