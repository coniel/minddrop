import { Designs, LayoutAxis, LayoutBox } from '@minddrop/designs-next';
import { resolveContentFitStyles } from '../resolveContentFitStyles';

/**
 * Resolves the styles sizing a box of a design's layout tree inside
 * the box holding it. In a column box the box takes its fixed
 * columns as a pixel basis and grows by its scaling columns. Along
 * the vertical axis a spacer keeps its unit height, an element is
 * bounded by its content fit, and an atomic box takes its unit
 * height as a minimum.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it.
 * @returns The box's sizing styles.
 */
export function resolveLayoutBoxStyle(
  box: LayoutBox,
  axis: LayoutAxis,
): React.CSSProperties {
  return {
    ...resolveWidthStyles(box, axis),
    ...resolveHeightStyles(box, axis),
  };
}

/**
 * Resolves the styles sizing a box's width: its flex share of a
 * column box, nothing in a band.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it.
 * @returns The width styles.
 */
function resolveWidthStyles(
  box: LayoutBox,
  axis: LayoutAxis,
): React.CSSProperties {
  // A band stretches to its rows box
  if (axis === 'rows') {
    return {};
  }

  return {
    flexGrow: box.columnUnits.scaling,
    flexShrink: 0,
    flexBasis: box.columnUnits.fixed * Designs.constants.UnitPixelSize,
  };
}

/**
 * Resolves the styles sizing a box's height from what it holds.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it.
 * @returns The height styles.
 */
function resolveHeightStyles(
  box: LayoutBox,
  axis: LayoutAxis,
): React.CSSProperties {
  // A spacer in a band keeps its unit height, one in a column box
  // stretches to it.
  if (box.type === 'spacer') {
    return axis === 'rows'
      ? { height: box.rowSpan * Designs.constants.UnitPixelSize }
      : {};
  }

  if (box.type === 'element') {
    return resolveContentFitStyles(box.element);
  }

  if (box.type === 'atom') {
    return { minHeight: box.rowSpan * Designs.constants.UnitPixelSize };
  }

  return {};
}
