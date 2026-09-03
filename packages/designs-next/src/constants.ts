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
 * The type of the placeholder box element.
 */
export const BoxElementType = 'box';

/**
 * The default width of a new design in grid units.
 */
export const DefaultDesignColumns = 48;

/**
 * The default height of a new design in grid units.
 */
export const DefaultDesignRows = 32;
