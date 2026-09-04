import { AspectRatioToken } from './types';

/**
 * Pixel size of a grid unit in the fluid render. Square, so element
 * aspect ratios match the design and fixed elements render at their
 * design size.
 */
export const UnitPixelSize = 4;

/**
 * The workspace directory designs are stored in. Distinct from the
 * legacy designs directory so the two can coexist until cutover.
 */
export const DesignsDirName = 'designs-next';

/**
 * The file extension of persisted design files.
 */
export const DesignFileExtension = 'json';

export const i18nRoot = 'designsNext';

/**
 * The type of the decorative box element.
 */
export const BoxElementType = 'box';

/**
 * The gap below a growing block, in grid units, at or under which
 * the growth shifts the elements below. Larger gaps absorb the
 * growth instead, shifting only once the gap is consumed.
 */
export const AutoGrowGapThreshold = 4;

/**
 * The width of a design in grid units. A single generous fixed
 * design-time width: rendering is fully fluid, so designs are
 * authored at one width rather than offering size choices.
 */
export const DefaultDesignColumns = 96;

/**
 * The aspect ratios offered for aspect-locked cards. Trimmed to
 * ratios whose derived row counts land on whole units at the design
 * width.
 */
export const CardAspectRatios: AspectRatioToken[] = [
  '2/3',
  '3/4',
  '4/5',
  '1/1',
  '4/3',
  '3/2',
  '16/9',
];

/**
 * The default height of a new design in grid units.
 */
export const DefaultDesignRows = 32;
