import { DesignElementType } from './types';

export const DesignsDirName = 'designs';
export const DesignFileExtension = 'design';
export const i18nRoot = 'designs';

/**
 * All design element types in display order.
 */
export const DesignElementTypes: DesignElementType[] = [
  'root',
  'container',
  'text',
  'formatted-text',
  'number',
  'image',
  'image-viewer',
  'icon',
];

/**
 * Leaf (non-container) design element types in display order.
 */
export const LeafDesignElementTypes: DesignElementType[] = [
  'text',
  'formatted-text',
  'number',
  'image',
  'image-viewer',
  'icon',
];
