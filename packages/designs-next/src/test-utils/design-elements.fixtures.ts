import { DesignElement } from '../types';
import {
  TestElementType,
  TestSlotElementType,
  TestSlotName,
} from './element-configs.fixtures';

// Column and row counts of the fixture card
export const cardColumns = 48;
export const cardRows = 32;

// Full-width fluid cover across the design's top
export const coverDesignElement: DesignElement = {
  id: 'element_cover',
  type: TestElementType,
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
  widthMode: 'fluid',
};

// Fluid title layered over the cover
export const titleDesignElement: DesignElement = {
  id: 'element_title',
  type: TestElementType,
  column: 2,
  row: 10,
  columnSpan: 28,
  rowSpan: 4,
  widthMode: 'fluid',
};

// Fixed icon layered over the cover, side by side with the title
export const iconDesignElement: DesignElement = {
  id: 'element_icon',
  type: TestElementType,
  column: 40,
  row: 8,
  columnSpan: 6,
  rowSpan: 6,
  widthMode: 'fixed-right',
};

// Growing fluid body below the cover
export const bodyDesignElement: DesignElement = {
  id: 'element_body',
  type: TestElementType,
  column: 2,
  row: 20,
  columnSpan: 44,
  rowSpan: 10,
  widthMode: 'fluid',
  contentFit: 'grow',
};

// The body, holding a caption in its slot
export const slottedDesignElement: DesignElement = {
  ...bodyDesignElement,
  id: 'element_slotted',
};

// Caption filling the body's slot
export const captionSlotElement: DesignElement = {
  ...bodyDesignElement,
  id: 'element_caption',
  type: TestSlotElementType,
  rowSpan: 4,
  parent: slottedDesignElement.id,
  slot: TestSlotName,
};

export const designElements = [
  coverDesignElement,
  titleDesignElement,
  iconDesignElement,
  bodyDesignElement,
];

// Full-width growing heading with two rows of gap above and below
export const designElement_heading: DesignElement = {
  id: 'element_heading',
  type: TestElementType,
  column: 0,
  row: 2,
  columnSpan: 48,
  rowSpan: 8,
  widthMode: 'fluid',
  contentFit: 'grow',
};

// Full-width fixed heading across the top of the stacked design
export const designElement_stackedHeading: DesignElement = {
  id: 'element_stackedHeading',
  type: TestElementType,
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 8,
  widthMode: 'fluid',
};

// Full-width growing body flush below the stacked heading
export const designElement_stackedBody: DesignElement = {
  id: 'element_stackedBody',
  type: TestElementType,
  column: 0,
  row: 8,
  columnSpan: 48,
  rowSpan: 16,
  widthMode: 'fluid',
  contentFit: 'grow',
};

// Full-width fixed footer a gap below the stacked body
export const designElement_stackedFooter: DesignElement = {
  id: 'element_stackedFooter',
  type: TestElementType,
  column: 0,
  row: 28,
  columnSpan: 48,
  rowSpan: 4,
  widthMode: 'fluid',
};

// Three fixed icons stacked in a column at the left edge, a gap of
// two rows between them.
export const designElement_besideIcon_1: DesignElement = {
  id: 'element_besideIcon_1',
  type: TestElementType,
  column: 0,
  row: 0,
  columnSpan: 6,
  rowSpan: 6,
  widthMode: 'fixed-left',
};

export const designElement_besideIcon_2: DesignElement = {
  ...designElement_besideIcon_1,
  id: 'element_besideIcon_2',
  row: 8,
};

export const designElement_besideIcon_3: DesignElement = {
  ...designElement_besideIcon_1,
  id: 'element_besideIcon_3',
  row: 16,
};

// Growing text beside the icon column, spanning all of its rows
export const designElement_besideText: DesignElement = {
  id: 'element_besideText',
  type: TestElementType,
  column: 8,
  row: 0,
  columnSpan: 40,
  rowSpan: 22,
  widthMode: 'fluid',
  contentFit: 'grow',
};

// The cover with a fluid height, scaling with a card's height
export const designElement_fluidCover: DesignElement = {
  ...coverDesignElement,
  id: 'element_fluidCover',
  heightMode: 'fluid',
};

// Full-width bar pinned to the bottom edge, in the last six rows of
// the fixture card.
export const designElement_bottomBar: DesignElement = {
  id: 'element_bottomBar',
  type: TestElementType,
  column: 0,
  row: 26,
  columnSpan: 48,
  rowSpan: 6,
  widthMode: 'fluid',
  heightMode: 'fixed-bottom',
};

// Five elements arranged as a pinwheel. No horizontal or vertical
// line crosses it without cutting one of them.
export const designElement_pinwheel_1: DesignElement = {
  id: 'element_pinwheel_1',
  type: TestElementType,
  column: 0,
  row: 0,
  columnSpan: 28,
  rowSpan: 8,
  widthMode: 'fluid',
};

export const designElement_pinwheel_2: DesignElement = {
  id: 'element_pinwheel_2',
  type: TestElementType,
  column: 30,
  row: 0,
  columnSpan: 18,
  rowSpan: 20,
  widthMode: 'fluid',
};

export const designElement_pinwheel_3: DesignElement = {
  id: 'element_pinwheel_3',
  type: TestElementType,
  column: 20,
  row: 22,
  columnSpan: 28,
  rowSpan: 10,
  widthMode: 'fluid',
};

export const designElement_pinwheel_4: DesignElement = {
  id: 'element_pinwheel_4',
  type: TestElementType,
  column: 0,
  row: 10,
  columnSpan: 18,
  rowSpan: 22,
  widthMode: 'fluid',
};

export const designElement_pinwheel_5: DesignElement = {
  id: 'element_pinwheel_5',
  type: TestElementType,
  column: 20,
  row: 10,
  columnSpan: 8,
  rowSpan: 10,
  widthMode: 'fluid',
};
