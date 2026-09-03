/**
 * Resolves the new width of each column when scaling columns to a
 * target total. Non-scaling columns stay one unit wide, scaling
 * columns get whole-unit widths by rounding the running total at each
 * column boundary, so cumulative positions track the proportional
 * layout and span ratios are preserved to the nearest unit. At least
 * one column must be marked as scaling.
 *
 * @param scaling - A flag per column, true when the column scales.
 * @param targetScalingTotal - Total units to distribute across scaling columns.
 * @returns The new width per column.
 */
export function resolveScaledWidths(
  scaling: boolean[],
  targetScalingTotal: number,
): number[] {
  // Share the target total evenly across the scaling columns
  const scalingCount = scaling.filter(Boolean).length;
  const exactWidth = targetScalingTotal / scalingCount;

  // Walk the columns accumulating exact widths, rounding the running
  // total at each boundary to keep widths whole.
  let exactPosition = 0;
  let roundedPosition = 0;

  return scaling.map((scales) => {
    // Advance by the column's exact width, one unit for fixed columns
    exactPosition += scales ? exactWidth : 1;

    // The column's width is the step to the next rounded boundary
    const width = Math.round(exactPosition) - roundedPosition;

    roundedPosition += width;

    return width;
  });
}
