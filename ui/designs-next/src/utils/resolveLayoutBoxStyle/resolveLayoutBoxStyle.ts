import { Designs, LayoutAxis, LayoutBox } from '@minddrop/designs-next';
import { resolveContentFitStyles } from '../resolveContentFitStyles';

/**
 * Resolves the styles sizing a box of a design's layout tree inside
 * the box holding it.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it, null for the root, which fills the render.
 * @param aspectLocked - Whether the design's height is fixed by its aspect ratio.
 * @returns The box's sizing styles.
 */
export function resolveLayoutBoxStyle(
  box: LayoutBox,
  axis: LayoutAxis | null,
  aspectLocked: boolean,
): React.CSSProperties {
  // Combine the width and height styles
  return {
    ...resolveWidthStyles(box, axis),
    ...resolveHeightStyles(box, axis, aspectLocked),
  };
}

/**
 * Resolves the styles sizing a box's width: its flex share of a
 * column box, nothing in a band or at the root.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it, null for the root.
 * @returns The width styles.
 */
function resolveWidthStyles(
  box: LayoutBox,
  axis: LayoutAxis | null,
): React.CSSProperties {
  // A band stretches to its rows box, the root to the render
  if (axis !== 'columns') {
    return {};
  }

  // Base the box on its fixed columns and grow it by its scaling
  // ones.
  return {
    flexGrow: box.columnUnits.scaling,
    flexShrink: 0,
    flexBasis: box.columnUnits.fixed * Designs.constants.UnitPixelSize,
  };
}

/**
 * Resolves the styles sizing a box's height from what it holds and
 * whether the design's height is fixed.
 *
 * @param box - The box to size.
 * @param axis - The axis of the box holding it, null for the root.
 * @param aspectLocked - Whether the design's height is fixed by its aspect ratio.
 * @returns The height styles.
 */
function resolveHeightStyles(
  box: LayoutBox,
  axis: LayoutAxis | null,
  aspectLocked: boolean,
): React.CSSProperties {
  // Under a fixed height a band takes its flex share of its rows
  // box, a column box stretches to its band, and the root fills the
  // render.
  if (aspectLocked) {
    return axis === 'rows' ? resolveRowShareStyles(box) : {};
  }

  // A spacer in a band keeps its unit height, one in a column box
  // stretches to it.
  if (box.type === 'spacer') {
    return axis === 'columns'
      ? {}
      : { height: box.rowSpan * Designs.constants.UnitPixelSize };
  }

  // Bound an element by its content fit
  if (box.type === 'element') {
    return resolveContentFitStyles(box.element);
  }

  // Give an atomic box its unit height as a minimum
  if (box.type === 'atom') {
    return { minHeight: box.rowSpan * Designs.constants.UnitPixelSize };
  }

  // Leave a rows or column box to its content
  return {};
}

/**
 * Resolves the flex styles giving a band its share of a fixed
 * height.
 *
 * @param box - The band.
 * @returns The band's flex styles.
 */
function resolveRowShareStyles(box: LayoutBox): React.CSSProperties {
  // Base the band on its fixed rows, grow it by its scaling ones and
  // let it shrink when the height falls short of the fixed rows.
  return {
    flexGrow: box.rowUnits.scaling,
    flexShrink: 1,
    flexBasis: box.rowUnits.fixed * Designs.constants.UnitPixelSize,
    minHeight: 0,
  };
}
