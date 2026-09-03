import { BoxElementType } from '../constants';
import { DesignElement } from '../types';

// Column and row counts of the fixture card
export const cardColumns = 48;
export const cardRows = 32;

// Full-width fluid cover across the design's top
export const coverDesignElement: DesignElement = {
  id: 'element_cover',
  type: BoxElementType,
  column: 0,
  row: 0,
  columnSpan: 48,
  rowSpan: 16,
  widthMode: 'fluid',
  naturalHeight: false,
};

// Fluid title layered over the cover
export const titleDesignElement: DesignElement = {
  id: 'element_title',
  type: BoxElementType,
  column: 2,
  row: 10,
  columnSpan: 28,
  rowSpan: 4,
  widthMode: 'fluid',
  naturalHeight: false,
};

// Fixed icon layered over the cover, side by side with the title
export const iconDesignElement: DesignElement = {
  id: 'element_icon',
  type: BoxElementType,
  column: 40,
  row: 8,
  columnSpan: 6,
  rowSpan: 6,
  widthMode: 'fixed-right',
  naturalHeight: false,
};

// Natural-height fluid body below the cover
export const bodyDesignElement: DesignElement = {
  id: 'element_body',
  type: BoxElementType,
  column: 2,
  row: 20,
  columnSpan: 44,
  rowSpan: 10,
  widthMode: 'fluid',
  naturalHeight: true,
};

export const designElements = [
  coverDesignElement,
  titleDesignElement,
  iconDesignElement,
  bodyDesignElement,
];
