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
  // The fixed units' pixel length
  const fixedLength = `${share.fixed * Designs.constants.UnitPixelSize}px`;

  // Format fixed units alone as pixels
  if (share.scaling === 0 || total.scaling === 0) {
    return fixedLength;
  }

  // The share of the scaling length these units take
  const scalingShare = resolveScalingShare(share, total);

  // Format every scaling unit of a region with no fixed unit as the
  // full length.
  if (share.fixed === 0 && scalingShare === '100%') {
    return '100%';
  }

  // Format scaling units alone as their share
  if (share.fixed === 0) {
    return `calc(${scalingShare})`;
  }

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
  // The length left for the region's scaling units
  const scalingLength =
    total.fixed === 0
      ? '100%'
      : `100% - ${total.fixed * Designs.constants.UnitPixelSize}px`;

  // Every scaling unit takes the whole length
  if (share.scaling === total.scaling) {
    return scalingLength;
  }

  // A subtraction needs grouping before the fraction is applied
  const grouped = total.fixed === 0 ? scalingLength : `(${scalingLength})`;

  return `${grouped} * ${share.scaling} / ${total.scaling}`;
}
