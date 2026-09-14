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
