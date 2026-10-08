import type { UiIconName } from '@minddrop/ui-icons';
import {
  AspectRatioToken,
  ContentWidth,
  DesignElementGroup,
  DesignType,
  ElementColor,
  ElementContentFit,
  ElementCornerRadius,
  ElementHeightMode,
  ElementPadding,
  ElementWidthMode,
  FontFamily,
  FontWeight,
  PaddingSize,
} from './types';

/**
 * The entity type of designs, prefixing their IDs.
 */
export const DesignEntityType = 'design';

/**
 * The entity type of design elements, prefixing their IDs.
 */
export const DesignElementEntityType = 'element';

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
 * The width of a new design in grid units, per design type. One
 * fixed design-time width per type: rendering is fully fluid, so
 * designs are authored at one width rather than offering size
 * choices.
 */
export const DesignTypeColumns: Record<DesignType, number> = {
  card: 96,
  list: 96,
  page: 240,
  space: 240,
};

/**
 * The reading widths a design can cap its content at, in display
 * order.
 */
export const ContentWidths: ContentWidth[] = ['narrow', 'regular', 'wide'];

/**
 * The width of a design capped at each reading width, in grid units.
 */
export const ContentWidthColumns: Record<ContentWidth, number> = {
  narrow: 120,
  regular: 180,
  wide: 240,
};

/**
 * The largest side padding a design can have, in pixels.
 */
export const MaxSidePadding = 200;

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
 * The height of a new design in grid units, per design type.
 */
export const DesignTypeRows: Record<DesignType, number> = {
  card: 32,
  list: 32,
  page: 200,
  space: 200,
};

/**
 * The minimum height of a design in grid units, flooring the
 * surface height drag and the fit to content.
 */
export const MinDesignRows = 8;

/**
 * The maximum height of a design in grid units, capping the
 * surface height drag and bottom-edge resizes past the design.
 */
export const MaxDesignRows = 1000;

/**
 * The snap resolutions offered in the editor, in grid units.
 */
export const SnapPresets = [1, 2, 4];

/**
 * The snap resolution the editor opens with, in grid units, per
 * design type.
 */
export const DesignTypeSnaps: Record<DesignType, number> = {
  card: 2,
  list: 2,
  page: 4,
  space: 4,
};

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
 * The corner radius an element taking one is drawn with until one
 * is picked.
 */
export const DefaultCornerRadius: ElementCornerRadius = 'sm';

/**
 * The smallest and largest sizes text can be set at, in pixels.
 */
export const MinFontSize = 6;
export const MaxFontSize = 200;

/**
 * The sides an element's padding can set, in visual order.
 */
export const PaddingSides: (keyof ElementPadding)[] = [
  'top',
  'right',
  'bottom',
  'left',
];

/**
 * The steps of the padding scale, from the smallest to the largest.
 */
export const PaddingScale: PaddingSize[] = [
  'xs',
  's',
  'm',
  'l',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
];

/**
 * The padding each step of the scale sets, in pixels.
 */
export const PaddingSizes: Record<PaddingSize, number> = {
  xs: 4,
  s: 6,
  m: 8,
  l: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
};

/**
 * The largest padding a side of an element can hold, in pixels.
 */
export const MaxElementPadding = 200;

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
