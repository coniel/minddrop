import { Designs, UnitShare } from '@minddrop/designs-next';

/**
 * Formats a count of grid units as a CSS length within a region:
 * fixed units at their pixel size, scaling units as their share of
 * the width or height left once the region's fixed units have
 * taken theirs.
 *
 * @param share - The units to format.
 * @param total - The units of the whole region along the axis.
 * @returns The CSS length.
 */
export function formatUnitLength(share: UnitShare, total: UnitShare): string {
  // Format the fixed units as pixels
  const fixedLength = `${share.fixed * Designs.constants.UnitPixelSize}px`;

  // Return the fixed units alone when nothing scales
  if (share.scaling === 0 || total.scaling === 0) {
    return fixedLength;
  }

  // Resolve the share of the scaling length these units take
  const scalingShare = resolveScalingShare(share, total);

  // Return the full length for every scaling unit of a region with
  // no fixed unit.
  if (share.fixed === 0 && scalingShare === '100%') {
    return '100%';
  }

  // Return the scaling share alone when there is no fixed unit
  if (share.fixed === 0) {
    return `calc(${scalingShare})`;
  }

  // Add the fixed length to the scaling share
  return `calc(${fixedLength} + ${scalingShare})`;
}

/**
 * Resolves the share some scaling units take of the length left for
 * a region's scaling units once its fixed units have taken theirs.
 *
 * @param share - The units taking the share.
 * @param total - The units of the whole region along the axis.
 * @returns The share, as a CSS expression.
 */
function resolveScalingShare(share: UnitShare, total: UnitShare): string {
  // Resolve the length left for the region's scaling units
  const scalingLength =
    total.fixed === 0
      ? '100%'
      : `100% - ${total.fixed * Designs.constants.UnitPixelSize}px`;

  // Return the whole length when every scaling unit takes it
  if (share.scaling === total.scaling) {
    return scalingLength;
  }

  // Group a subtraction before the fraction is applied
  const grouped = total.fixed === 0 ? scalingLength : `(${scalingLength})`;

  // Apply the fraction to the grouped length
  return `${grouped} * ${share.scaling} / ${total.scaling}`;
}
