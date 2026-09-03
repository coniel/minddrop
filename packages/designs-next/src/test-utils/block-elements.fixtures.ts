import { BlockElement } from '../types';

// Column and row counts of the fixture card
export const cardColumns = 48;
export const cardRows = 32;

// Full-width fluid cover across the card's top
export const coverElement: BlockElement = {
  id: 'element-cover',
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
  widthMode: 'fluid',
  naturalHeight: false,
};

// Fluid title layered over the cover
export const titleElement: BlockElement = {
  id: 'element-title',
  column: 2,
  row: 10,
  columnSpan: 28,
  rowSpan: 4,
  widthMode: 'fluid',
  naturalHeight: false,
};

// Fixed icon layered over the cover, side by side with the title
export const iconElement: BlockElement = {
  id: 'element-icon',
  column: 40,
  row: 8,
  columnSpan: 6,
  rowSpan: 6,
  widthMode: 'fixed-right',
  naturalHeight: false,
};

// Natural-height fluid body below the cover
export const bodyElement: BlockElement = {
  id: 'element-body',
  column: 2,
  row: 20,
  columnSpan: 44,
  rowSpan: 10,
  widthMode: 'fluid',
  naturalHeight: true,
};

export const blockElements = [
  coverElement,
  titleElement,
  iconElement,
  bodyElement,
];
