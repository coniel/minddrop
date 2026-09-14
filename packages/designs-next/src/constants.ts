import type { UiIconName } from '@minddrop/ui-icons';
import {
  AspectRatioToken,
  DesignElementGroup,
  DesignType,
  ElementColor,
  ElementContentFit,
  ElementHeightMode,
  ElementWidthMode,
  FontFamily,
  FontWeight,
} from './types';

/**
 * The icon representing designs and design editing.
 */
export const DesignsIcon: UiIconName = 'pencil-ruler';

/**
 * The icon representing each design type.
 */
export const DesignTypeIcons: Record<DesignType, UiIconName> = {
  card: 'layout-grid',
  list: 'layout-list',
  page: 'layout',
  space: 'panels-top-left',
};

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

/**
 * The minimum height of a design in grid units, flooring the
 * surface height drag and the fit to content.
 */
export const MinDesignRows = 8;

/**
 * The maximum height of a design in grid units, capping the
 * surface height drag and bottom-edge resizes past the design.
 */
export const MaxDesignRows = 200;

/**
 * The snap resolutions offered in the editor, in grid units.
 */
export const SnapPresets = [1, 2, 4];

/**
 * The element palette groups in display order.
 */
export const DesignElementGroups: DesignElementGroup[] = ['content', 'layout'];

/**
 * The width modes an element may declare.
 */
export const ElementWidthModes: ElementWidthMode[] = [
  'fluid',
  'fixed-left',
  'fixed-right',
  'fixed-proportional',
];

/**
 * The height modes an element may declare.
 */
export const ElementHeightModes: ElementHeightMode[] = [
  'fluid',
  'fixed-top',
  'fixed-bottom',
  'fixed-proportional',
];

/**
 * The content fits an element may declare.
 */
export const ElementContentFits: ElementContentFit[] = [
  'fixed',
  'grow',
  'shrink',
  'natural',
];

/**
 * The families text elements can be set in, in display order.
 */
export const FontFamilies: FontFamily[] = ['sans', 'serif', 'mono'];

/**
 * The weights text elements can be set in, from the lightest to
 * the heaviest.
 */
export const FontWeights: FontWeight[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

/**
 * The conventional text sizes in pixels, offered as a ladder ahead
 * of an arbitrary size.
 */
export const FontSizes: number[] = [
  10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48,
];

/**
 * The size text is set at until one is picked, in pixels.
 */
export const DefaultFontSize = 14;

/**
 * The smallest and largest sizes text can be set at, in pixels.
 */
export const MinFontSize = 6;
export const MaxFontSize = 200;

/**
 * The conventional line heights as multiples of the font size,
 * offered as a ladder ahead of an arbitrary one.
 */
export const LineHeights: number[] = [1, 1.2, 1.4, 1.5, 1.65, 1.75, 2, 2.5];

/**
 * The height of a line of text as a multiple of its font size
 * until one is picked.
 */
export const DefaultLineHeight = 1.4;

/**
 * The smallest and largest line heights text can be set at, as
 * multiples of the font size.
 */
export const MinLineHeight = 0.8;
export const MaxLineHeight = 3;

/**
 * The amount a line height steps by when nudged.
 */
export const LineHeightStep = 0.05;

/**
 * The colour text elements are drawn in until one is picked: the
 * design's own scheme at the step body text is set in.
 */
export const DefaultTextColor: ElementColor = {
  color: 'default',
  level: 1200,
};
