import { AutoGrowGapThreshold } from '../../constants';
import { DesignElement } from '../../types';
import { rowsOverlap } from '../rowsOverlap';

export interface ApplyElementSettingsOptions {
  /**
   * The design's row count.
   */
  rows: number;

  /**
   * The element's minimum row span in grid units, resolved for the
   * element with the settings applied. Defaults to one unit.
   */
  minRowSpan?: number;

  /**
   * The element's vertical resize step in grid units, resolved for
   * the element with the settings applied. When given, the span
   * stays on whole steps.
   */
  rowSpanStep?: number;

  /**
   * The element's vertical resize step before the settings change.
   * When both steps are given, the span maps its current step count
   * onto the new step, so line-based elements keep their line count.
   */
  previousRowSpanStep?: number;
}

export interface ApplyElementSettingsResult<
  TElement extends DesignElement = DesignElement,
> {
  /**
   * The elements with the settings applied and any displaced
   * elements shifted down.
   */
  elements: TElement[];

  /**
   * The design's row count, following the shift of the elements
   * below the changed element.
   */
  rows: number;
}

/**
 * Applies a settings change to an element, adjusting the layout
 * when the change affects the element's height.
 *
 * @param elements - The design's elements.
 * @param elementId - The element the settings apply to.
 * @param settings - The settings values to merge into the element.
 * @param options - The grid context and resolved height constraints.
 * @returns The updated elements and row count.
 */
export function applyElementSettings<TElement extends DesignElement>(
  elements: TElement[],
  elementId: string,
  settings: Record<string, unknown>,
  options: ApplyElementSettingsOptions,
): ApplyElementSettingsResult<TElement> {
  const { rows, minRowSpan = 1, rowSpanStep, previousRowSpanStep } = options;

  // Get the target element
  const target = elements.find((element) => element.id === elementId);

  if (!target) {
    return { elements, rows };
  }

  // Merge the settings into the element
  const updated = { ...target, ...settings };

  // Adjust the span to the new step and minimum
  updated.rowSpan = quantizeRowSpan(
    target.rowSpan,
    minRowSpan,
    rowSpanStep,
    previousRowSpanStep,
  );

  // Bottom edges of the elements sharing rows with the block, which
  // hold the band's bottom edge while they reach below the block
  const bandBottoms = elements
    .filter(
      (element) => element.id !== elementId && rowsOverlap(target, element),
    )
    .map((element) => element.row + element.rowSpan);

  // The row band's bottom edge before and after the change
  const oldBandBottom = Math.max(target.row + target.rowSpan, ...bandBottoms);
  const newBandBottom = Math.max(updated.row + updated.rowSpan, ...bandBottoms);

  // Top edges of the elements below the band
  const belowEdges = elements
    .filter(
      (element) => element.id !== elementId && element.row >= oldBandBottom,
    )
    .map((element) => element.row);

  // The gap between the band and the nearest element below it, or
  // the card's bottom edge when nothing sits below.
  const gap = Math.max(
    (belowEdges.length > 0 ? Math.min(...belowEdges) : rows) - oldBandBottom,
    0,
  );

  // How far the elements below follow the band's bottom edge
  const shift = resolveShift(newBandBottom - oldBandBottom, gap);

  // Swap in the updated element, shifting elements below the band
  // along with its bottom edge.
  const applied = elements.map((element) => {
    if (element.id === elementId) {
      return updated;
    }

    if (shift !== 0 && element.row >= oldBandBottom) {
      return { ...element, row: element.row + shift };
    }

    return element;
  });

  return { elements: applied, rows: rows + shift };
}

/**
 * Resolves how far the elements below the row band shift.
 *
 * @param delta - The band's bottom edge movement in grid units.
 * @param gap - The gap below the band in grid units.
 * @returns The shift in grid units, negative when pulling up.
 */
function resolveShift(delta: number, gap: number): number {
  // Tight gaps hold, following the full delta in either direction
  if (gap <= AutoGrowGapThreshold) {
    return delta;
  }

  // Larger gaps absorb growth, pushing only what outgrows the gap
  if (delta > 0) {
    return Math.max(delta - gap, 0);
  }

  // Shrinking under a large gap leaves the elements below put
  return 0;
}

/**
 * Snaps a row span onto the element's step, keeping it at or above
 * the minimum.
 *
 * @param rowSpan - The element's current row span.
 * @param min - The minimum row span.
 * @param step - The row span step, when the element has one.
 * @param previousStep - The step before the settings change.
 * @returns The quantized row span.
 */
function quantizeRowSpan(
  rowSpan: number,
  min: number,
  step?: number,
  previousStep?: number,
): number {
  // Without a step only the floor applies
  if (!step) {
    return Math.max(rowSpan, min);
  }

  // Map the span's step count onto the new step, so line-based
  // elements keep their line count when the step changes.
  if (previousStep) {
    const steps = Math.max(Math.round(rowSpan / previousStep), 1);

    return Math.max(steps * step, min);
  }

  // Round the span to the nearest whole step, keeping the minimum
  return Math.max(Math.round(rowSpan / step) * step, min);
}
