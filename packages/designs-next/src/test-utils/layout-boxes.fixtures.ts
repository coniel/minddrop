import { LayoutAtomBox, LayoutElementBox, LayoutSpacerBox } from '../types';
import {
  coverDesignElement,
  designElement_besideIcon_1,
  designElement_besideIcon_2,
  designElement_besideIcon_3,
  designElement_besideText,
  iconDesignElement,
  titleDesignElement,
} from './design-elements.fixtures';

// The gap column between the icons and the text of the icons beside
// text design.
export const layoutBox_gap: LayoutSpacerBox = {
  type: 'spacer',
  column: 6,
  row: 0,
  columnSpan: 2,
  rowSpan: 22,
  columnUnits: { fixed: 2, scaling: 0 },
  rowUnits: { fixed: 22, scaling: 0 },
};

// The text column of the icons beside text design
export const layoutBox_text: LayoutElementBox = {
  type: 'element',
  column: 8,
  row: 0,
  columnSpan: 40,
  rowSpan: 22,
  columnUnits: { fixed: 0, scaling: 40 },
  rowUnits: { fixed: 22, scaling: 0 },
  element: designElement_besideText,
};

// The icon column of the icons beside text design, uncut
export const layoutBox_iconColumn: LayoutAtomBox = {
  type: 'atom',
  column: 0,
  row: 0,
  columnSpan: 6,
  rowSpan: 22,
  columnUnits: { fixed: 6, scaling: 0 },
  rowUnits: { fixed: 22, scaling: 0 },
  elements: [
    designElement_besideIcon_1,
    designElement_besideIcon_2,
    designElement_besideIcon_3,
  ],
};

// The cover band of the fixture card, holding the layered cover,
// title and icon.
export const layoutBox_coverBand: LayoutAtomBox = {
  type: 'atom',
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
  columnUnits: { fixed: 0, scaling: 48 },
  rowUnits: { fixed: 16, scaling: 0 },
  elements: [coverDesignElement, titleDesignElement, iconDesignElement],
};
