import { Design, LayoutBox, LayoutRegion } from '../../types';
import { cutRegion } from '../cutRegion';
import { resolveChildElements } from '../resolveChildElements';
import { resolveRegionScalingColumns } from '../resolveRegionScalingColumns';
import { resolveRegionScalingRows } from '../resolveRegionScalingRows';
import { resolveSliceUnits } from '../resolveSliceUnits';

/**
 * Compiles a design into the tree of boxes it renders as. The design
 * is cut into bands at every horizontal line no element crosses.
 * Where there is none, it is cut into column boxes at every vertical
 * one. A region with no element in it is a spacer, a region one
 * element fills is that element, and a region no line cuts is
 * atomic, holding its elements at their unit rects.
 *
 * @param design - The design to compile.
 * @returns The root box of the tree.
 */
export function resolveLayoutTree(design: Design): LayoutBox {
  // The design's own elements, which it lays out. An element held
  // by another is placed by it.
  const elements = resolveChildElements(design.elements);
  // The whole design
  const region: LayoutRegion = {
    column: 0,
    row: 0,
    columnSpan: design.columns,
    rowSpan: design.rows,
  };

  // Classify the design's columns and rows against its own elements
  const units = resolveSliceUnits(
    region,
    resolveRegionScalingColumns(elements, region),
    resolveRegionScalingRows(elements, region),
    region,
  );

  // Cut the whole design
  return cutRegion(region, elements, units);
}
